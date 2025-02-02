import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article } from '../types';
import { getArticle } from '../services/articleService';
import { motion } from 'framer-motion';
import { Clock, User as UserIcon, Calendar, Link as LinkIcon } from 'lucide-react';

export function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(id as string);
        setArticle(data.article);
        setRecommendedArticles(data.recommended || []);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              {article.author && (
                <div className="flex items-center space-x-1">
                  <UserIcon className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <LinkIcon className="h-4 w-4" />
                <span>{article.source}</span>
              </a>
            </div>
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
        </div>

        <div className="lg:col-span-1">
          <div className="border-b border-gray-200 mb-6">
            <h2 className="text-xl font-bold pb-2">Recommended Articles</h2>
          </div>
          <div className="space-y-6">
            {recommendedArticles.map((article) => (
              <motion.div
                key={article.id}
                className="flex gap-4 items-start pt-4 border-t border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.img
                  src={article.image_url || ''}
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                />
                <div>
                  <Link
                    to={`/articles/${article.id}`}
                    className="block"
                  >
                    <h3 className="font-medium text-base hover:text-blue-600 line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    {article.author && (
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 