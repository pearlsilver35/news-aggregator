<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NewsScraperService;

class ScrapeArticles extends Command
{
    protected $signature = 'articles:scrape';
    protected $description = 'Scrape articles from configured news sources';

    private $scraperService;

    public function __construct(NewsScraperService $scraperService)
    {
        parent::__construct();
        $this->scraperService = $scraperService;
    }

    public function handle()
    {
        $this->info('Starting article scraping...');
        
        try {
            $results = $this->scraperService->scrapeAllSources();
            
            if (!empty($results['errors'])) {
                foreach ($results['errors'] as $source => $error) {
                    $this->error("Error scraping $source: " . $error);
                }
            }
            
            if (!empty($results['success'])) {
                foreach ($results['success'] as $source => $count) {
                    $this->info("Successfully scraped $count articles from $source");
                }
            }
            
            $this->info('Article scraping completed.');
        } catch (\Exception $e) {
            $this->error('Fatal error during scraping: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
} 