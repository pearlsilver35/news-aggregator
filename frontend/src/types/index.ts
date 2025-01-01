export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    sources: string[];
    categories: string[];
    authors: string[];
  };
}

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string | null;
  source: string;
  source_url: string;
  image_url: string | null;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface SearchFilters {
  keyword?: string;
  date?: string;
  category?: string;
  source?: string;
  author?: string;
}

export interface ArticleFilters {
  keyword?: string;
  categories?: string[];
  sources?: string[];
  authors?: string[];
}