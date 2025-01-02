import { useEffect, useState } from 'react';
import { filterService } from '../services/filterService';
import { Tooltip } from './ui/tooltip';
import { RepeatIcon } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: {
    date?: string;
    category?: string;
    source?: string;
    author?: string;
  }) => void;
  selectedFilters: {
    date: string;
    category: string;
    source: string;
    author: string;
  };
  onResetFilters: () => void;
}

export default function Filters({ onFilterChange, selectedFilters, onResetFilters }: FiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categoriesData, sourcesData, authorsData] = await Promise.all([
          filterService.getCategories(),
          filterService.getSources(),
          filterService.getAuthors()
        ]);

        setCategories(categoriesData.categories);
        setSources(sourcesData.sources);
        setAuthors(authorsData.authors);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleReset = () => {
    onResetFilters();
  };

  if (loading) {
    return (
      <div className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-gray-500">Loading filters...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.date}
              onChange={(e) => onFilterChange({ date: e.target.value })}
            />
          </div>

          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.source}
              onChange={(e) => onFilterChange({ source: e.target.value })}
            >
              <option value="">All Sources</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <select
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.author}
              onChange={(e) => onFilterChange({ author: e.target.value })}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end md:self-end">
            <Tooltip content="Reset Filters">
              <button
                onClick={handleReset}
                className="p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Reset filters"
              >
                <RepeatIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}