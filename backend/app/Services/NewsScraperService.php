<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsScraperService
{
    private $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    public function scrapeAllSources()
    {
        $results = [
            'success' => [],
            'errors' => []
        ];

        try {
            $results['NewsAPI'] = $this->scrapeNewsAPI();
            $results['Guardian'] = $this->scrapeTheGuardian();
            $results['NYTimes'] = $this->scrapeNYTimes();
        } catch (\Exception $e) {
            $results['errors']['general'] = $e->getMessage();
        }

        return $results;
    }

    private function scrapeNewsAPI()
    {
        try {
            $response = Http::get(config('services.newsapi.url'), [
                'apiKey' => config('services.newsapi.key'),
                'q' => 'news',
                'sortBy' => 'publishedAt',
                'language' => 'en'
            ]);

            if ($response->successful()) {
                $articles = $response->json()['articles'] ?? [];
                $savedCount = 0;
                
                foreach ($articles as $article) {
                    if (empty($article['title'])) {
                        continue;
                    }

                    try {
                        $publishedAt = date('Y-m-d H:i:s', strtotime($article['publishedAt']));
                        $article['publishedAt'] = $publishedAt; // Update the date format
                        $this->saveArticle($article, 'NewsAPI');
                        $savedCount++;
                    } catch (\Exception $e) {
                        Log::error('Failed to save NewsAPI article: ' . $e->getMessage());
                    }
                }
                
                return ['success' => $savedCount];
            }
            
            return ['error' => 'API request failed'];
        } catch (\Exception $e) {
            Log::error('NewsAPI scraping failed: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    private function scrapeTheGuardian()
    {
        try {
            $response = Http::get(config('services.guardian.url'), [
                'api-key' => config('services.guardian.key'),
                'q' => 'news',
                'show-fields' => 'thumbnail,bodyText',
                'order-by' => 'newest'
            ]);

            if ($response->successful()) {
                $articles = $response->json()['response']['results'] ?? [];
                foreach ($articles as $article) {
                    $this->saveArticle($article, 'The Guardian');
                }
            }
        } catch (\Exception $e) {
            Log::error('The Guardian scraping failed: ' . $e->getMessage());
        }
    }

    private function scrapeNYTimes()
    {
        try {
            $response = Http::get(config('services.nytimes.url'), [
                'api-key' => config('services.nytimes.key'),
                'q' => 'news',
                'sort' => 'newest'
            ]);

            if ($response->successful()) {
                $articles = $response->json()['response']['docs'] ?? [];
                foreach ($articles as $article) {
                    $this->saveArticle($article, 'NY Times');
                }
            }
        } catch (\Exception $e) {
            Log::error('NY Times scraping failed: ' . $e->getMessage());
        }
    }

    private function saveArticle($articleData, $source)
    {
        try {
            $data = $this->formatArticleData($articleData, $source);

            // Check for duplicates based on a unique attribute, e.g., source_url
            $existingArticle = Article::where('source_url', $data['source_url'])->first();
            if ($existingArticle) {
                Log::info("Duplicate article found from $source: " . $data['title']);
                return; // Skip saving if duplicate is found
            }

            $this->articleService->saveArticle($data);
        } catch (\Exception $e) {
            Log::error("Failed to save article from $source: " . $e->getMessage());
            throw $e;
        }
    }

    private function formatArticleData($articleData, $source)
    {
        switch ($source) {
            case 'NewsAPI':
                if (empty($articleData['title'])) {
                    throw new \InvalidArgumentException('Article title is required');
                }

                return [
                    'title' => $articleData['title'],
                    'content' => $articleData['content'] ?? '',
                    'source' => $source,
                    'category' => $articleData['category'] ?? 'General',
                    'published_at' => $articleData['publishedAt'],
                    'image_url' => $articleData['urlToImage'] ?? null,
                    'source_url' => $articleData['url'] ?? null,
                    'author' => $articleData['author'] ?? null,
                ];
            
            case 'The Guardian':
                if (empty($articleData['webTitle'])) {
                    throw new \InvalidArgumentException('Article title is required');
                }
                return [
                    'title' => $articleData['webTitle'],
                    'content' => $articleData['fields']['bodyText'] ?? '',
                    'source' => $source,
                    'category' => $articleData['sectionName'] ?? 'General',
                    'published_at' => date('Y-m-d H:i:s', strtotime($articleData['webPublicationDate'])),
                    'image_url' => $articleData['fields']['thumbnail'] ?? null,
                    'source_url' => $articleData['webUrl'] ?? null,
                    'author' => $articleData['fields']['byline'] ?? null,
                ];
                
            case 'NY Times':
                if (empty($articleData['headline']['main'])) {
                    throw new \InvalidArgumentException('Article title is required');
                }
                
                // Get the image URL and add base URL if it exists
                $imageUrl = null;
                if (isset($articleData['multimedia'][0])) {
                    $imageUrl = $articleData['multimedia'][0]['url'];
                    // Check if the URL is relative (doesn't start with http/https)
                    if ($imageUrl && !str_starts_with($imageUrl, 'http')) {
                        $imageUrl = 'https://static01.nyt.com/' . ltrim($imageUrl, '/');
                    }
                }
                
                return [
                    'title' => $articleData['headline']['main'],
                    'content' => $articleData['abstract'] ?? '',
                    'source' => $source,
                    'category' => $articleData['section_name'] ?? 'General',
                    'published_at' => date('Y-m-d H:i:s', strtotime($articleData['pub_date'])),
                    'image_url' => $imageUrl,
                    'source_url' => $articleData['web_url'] ?? null,
                    'author' => $articleData['byline']['original'] ?? null,
                ];
                
            default:
                throw new \InvalidArgumentException('Unknown source: ' . $source);
        }
    }
} 