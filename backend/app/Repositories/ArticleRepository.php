<?php

namespace App\Repositories;

use App\Models\Article;
use App\Models\UserPreferences;
use Illuminate\Database\Eloquent\Builder;

class ArticleRepository implements ArticleRepositoryInterface
{
    public function getFiltered(array $filters)
    {
        $query = Article::query();
        
        $this->applyPreferencesOrFilters($query, $filters)
             ->applyKeywordFilter($query, $filters)
             ->applyDateFilter($query, $filters)
             ->applyOrderBy($query);
        
        return $query->paginate(6);
    }

    private function applyPreferencesOrFilters(Builder $query, array $filters): self
    {
        if (auth()->check() && !$this->hasExplicitFilters($filters)) {
            $this->applyUserPreferences($query);
        } else {
            $this->applyBasicFilters($query, $filters);
        }
        
        return $this;
    }

    private function applyKeywordFilter(Builder $query, array $filters): self
    {
        if (isset($filters['keyword'])) {
            $query->where('title', 'like', '%' . $filters['keyword'] . '%')
                  ->orWhere('content', 'like', '%' . $filters['keyword'] . '%');
        }
        
        return $this;
    }

    private function applyDateFilter(Builder $query, array $filters): self
    {
        if (isset($filters['date'])) {
            $query->whereDate('published_at', $filters['date']);
        }
        
        return $this;
    }

    private function applyOrderBy(Builder $query): self
    {
        $query->orderBy('published_at', 'desc');
        return $this;
    }

    private function hasExplicitFilters(array $filters): bool
    {
        return isset($filters['category']) || 
               isset($filters['source']) || 
               isset($filters['author']);
    }

    private function applyBasicFilters(Builder $query, array $filters): void
    {
        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['source'])) {
            $query->where('source', $filters['source']);
        }

        if (isset($filters['author'])) {
            $query->where('author', $filters['author']);
        }
    }

    public function create(array $data)
    {
        return Article::create($data);
    }

    public function getCategories()
    {
        return Article::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');
    }

    public function getSources()
    {
        return Article::select('source')
            ->distinct()
            ->whereNotNull('source')
            ->pluck('source');
    }

    public function getAuthors()
    {
        return Article::select('author')
            ->distinct()
            ->whereNotNull('author')
            ->pluck('author');
    }

    private function applyUserPreferences($query)
    {
        $preferences = UserPreferences::where('user_id', auth()->id())->first();
        
        if ($preferences) {
            $preferences = json_decode($preferences->preferences, true);
            
            if (!empty($preferences['sources'])) {
                $query->whereIn('source', $preferences['sources']);
            }
            
            if (!empty($preferences['categories'])) {
                $query->whereIn('category', $preferences['categories']);
            }
            
            if (!empty($preferences['authors'])) {
                $query->whereIn('author', $preferences['authors']);
            }
        }
    }
} 