<?php

namespace App\Repositories;

interface ArticleRepositoryInterface
{
    public function getFiltered(array $filters);
    public function create(array $data);
    public function getCategories();
    public function getSources();
    public function getAuthors();
} 