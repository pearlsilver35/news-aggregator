import { useState, useEffect } from 'react';
import { Article, ArticleFilters } from '../types';
import { fetchArticles } from '../api/articles';

export const useArticles = (filters: ArticleFilters) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                setLoading(true);
                const data = await fetchArticles(filters);
                setArticles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, [filters]);

    return { articles, loading, error };
}; 