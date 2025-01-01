import React from 'react';
import { Article } from '../types';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-lg shadow-xl">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{new Date(article.published_at).toLocaleDateString()}</span>
                {article.author && <span>By {article.author}</span>}
                <span>Source: {article.source}</span>
              </div>
              
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {article.content || article.description}
              </p>
              
              {article.source_url && (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Read Original Article
                </a>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ArticleDetailModal; 