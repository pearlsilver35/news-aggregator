import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { User as UserIcon, Calendar } from 'lucide-react';
import { ArticleCard } from './ArticleCard';

interface ArticleLayoutProps {
  articles: Article[];
  isFilterActive: boolean;
  onRefresh: () => void;
}

export function ArticleLayout({ articles, isFilterActive, onRefresh }: ArticleLayoutProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold">No Articles Found</h2>
        <p className="text-gray-600">There are no articles available based on your selected filters.</p>
        <p className="text-gray-600">You can check your personalized filters or refresh the page.</p>
        <button
          onClick={onRefresh}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  if (isFilterActive) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  }

  if (articles.length === 1) {
    return (
      <div className="max-w-3xl mx-auto">
        <ArticleCard article={articles[0]} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={articles[0].image_url || ''}
            alt={articles[0].title}
            className="w-full h-[400px] object-cover rounded-lg"
            whileHover={{ scale: 1.05 }}
          />
          <h1 className="text-3xl font-bold">{articles[0].title}</h1>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600 mb-4 line-clamp-2">{articles[0].description}</p>
            <p className="text-gray-700 mb-4 line-clamp-3">{articles[0].content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{articles[0].source}</span>
                {articles[0].author && (
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{articles[0].author}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(articles[0].published_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Link
                to={`/articles/${articles[0].id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Read More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="md:col-span-1">
        <div className="border-b border-gray-200 mb-6">
          <h2 className="text-xl font-bold pb-2">Top Stories</h2>
        </div>
        <div className="space-y-6">
          {articles.slice(1, 2).map((article) => (
            <motion.div
              key={article.id}
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.img
                src={article.image_url || ''}
                alt={article.title}
                className="w-full h-48 object-cover rounded"
                whileHover={{ scale: 1.05 }}
              />
              <Link
                to={`/articles/${article.id}`}
                className="block"
              >
                <h3 className="font-semibold text-lg hover:text-blue-600">
                  {article.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {article.author && (
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {articles.slice(2, 7).map((article) => (
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
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 