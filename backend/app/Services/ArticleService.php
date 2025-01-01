<?php

namespace App\Services;

use App\Models\Article;
use App\Repositories\ArticleRepository;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Exception;

class ArticleService
{
    private $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function getFilteredArticles(array $filters): LengthAwarePaginator
    {
        try {
            return $this->articleRepository->getFiltered($filters);
        } catch (Exception $e) {
            throw new Exception('Unable to retrieve articles');
        }
    }

    public function saveArticle(array $data)
    {
        return $this->articleRepository->create($data);
    }

    public function getCategories(): Collection
    {
        try {
            return $this->articleRepository->getCategories();
        } catch (Exception $e) {
            throw new Exception('Unable to retrieve categories');
        }
    }

    public function getSources(): Collection
    {
        try {
            return $this->articleRepository->getSources();
        } catch (Exception $e) {
            throw new Exception('Unable to retrieve sources');
        }
    }

    public function getAuthors(): Collection
    {
        try {
            return $this->articleRepository->getAuthors();
        } catch (Exception $e) {
            throw new Exception('Unable to retrieve authors');
        }
    }
} 