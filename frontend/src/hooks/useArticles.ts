import { useState, useCallback } from 'react';
import { Article, SearchFilters } from '../types';
import { articleService, PaginatedResponse } from '../services/articleService';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Article>, 'data'> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ keyword: '' });

  const fetchArticles = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await articleService.getArticles(page, filters);
      setArticles(response.data);
      setPagination(response);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSearch = (keyword: string) => {
    setFilters(prev => ({ ...prev, keyword }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const initialFilters: SearchFilters = { keyword: '', date: '', category: '', source: '', author: '' };
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    articles,
    pagination,
    currentPage,
    isLoading,
    filters,
    fetchArticles,
    handleFilterChange,
    handleSearch,
    handleResetFilters,
    handlePageChange
  };
} 