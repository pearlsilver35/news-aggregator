import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Clock, Eye } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export function ArticleCard({ article, compact }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/articles/${article.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className={`w-full ${compact ? 'h-40' : 'h-48'} object-cover`}
          />
        )}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">{article.source}</span>
          </div>
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold mb-2 line-clamp-2`}>
            {article.title}
          </h3>
          {!compact && (
            <>
              <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
              <p className="text-gray-700 mb-4 line-clamp-3">{article.content}</p>
            </>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{formatDate(article.published_at)}</span>
              {article.author && (
                <>
                  <span>By {article.author}</span>
                </>
              )}
            </div>
            <a 
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              title="Read More"
            >
              <Eye className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}