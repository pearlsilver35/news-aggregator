import { useEffect, useState } from 'react';
import { filterService } from '../services/filterService';

interface FiltersProps {
  onFilterChange: (filters: {
    date?: string;
    category?: string;
    source?: string;
    author?: string;
  }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    date: '',
    category: '',
    source: '',
    author: ''
  });

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

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
            >
              <option value="">All Sources</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <select
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              value={selectedFilters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}