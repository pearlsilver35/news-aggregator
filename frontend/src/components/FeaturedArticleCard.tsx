import React, { useState } from 'react';
import { Article } from '../types';
import { Clock, Eye, MessageSquare, Share2, User } from 'lucide-react';
import ArticleDetailModal from './ArticleDetailModal';

interface FeaturedArticleCardProps {
  article: Article;
}

export default function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Top Story</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Article Image - 8 columns */}
          <div className="md:col-span-8">
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            )}
          </div>

          {/* Article Content - 4 columns */}
          <div className="md:col-span-4 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
              {article.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>3.5k Views</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                  <MessageSquare className="h-4 w-4" />
                  <span>05 Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                  <Share2 className="h-4 w-4" />
                  <span>1.5k Share</span>
                </button>
              </div>
              <button 
                onClick={() => setShowDetail(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>

      <ArticleDetailModal
        article={article}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
} 