import { PaginatedResponse } from '../services/articleService';
import { Article } from '../types';

interface PaginationProps {
  pagination: Omit<PaginatedResponse<Article>, 'data'>;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  return (
    <div className="mt-8 flex justify-center">
      <nav className="flex items-center gap-2">
        {pagination.current_page > 1 && (
          <button
            onClick={() => onPageChange(pagination.current_page - 1)}
            className="px-3 py-1 rounded border hover:bg-gray-100"
          >
            Previous
          </button>
        )}

        <span className="px-3 py-1">
          Page {pagination.current_page} of {pagination.last_page}
        </span>

        {pagination.current_page < pagination.last_page && (
          <button
            onClick={() => onPageChange(pagination.current_page + 1)}
            className="px-3 py-1 rounded border hover:bg-gray-100"
          >
            Next
          </button>
        )}
      </nav>
    </div>
  );
} 