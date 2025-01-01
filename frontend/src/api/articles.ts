import axios from 'axios';
import { Article, ArticleFilters } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchArticles = async (filters: ArticleFilters): Promise<Article[]> => {
    const response = await axios.get(`${API_BASE_URL}/articles`, { params: filters });
    return response.data;
}; 