import { Article, SearchFilters } from '../types';
import { authService } from './auth';

const API_URL = 'http://localhost:8000/api';

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (authService.isAuthenticated()) {
    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = token;
    }
  }

  return headers;
};

export const articleService = {
  async getArticles(page: number = 1, filters: SearchFilters = { keyword: '' }): Promise<PaginatedResponse<Article>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...filters
    });

    const response = await fetch(`${API_URL}/articles?${queryParams}`, {
      headers: getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    return response.json();
  },
}; 