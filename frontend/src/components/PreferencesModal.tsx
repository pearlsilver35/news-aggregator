import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User } from '../types';
import { filterService } from '../services/filterService';
import { preferencesService } from '../services/preferencesService';
import { toast } from 'react-hot-toast';

interface PreferencesModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: User['preferences']) => void;
}

export default function PreferencesModal({
  user,
  isOpen,
  onClose,
  onSave,
}: PreferencesModalProps) {
  const [preferences, setPreferences] = useState({
    sources: user.preferences?.sources || [],
    categories: user.preferences?.categories || [],
    authors: user.preferences?.authors || []
  });
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sourcesData, categoriesData, authorsData, savedPreferences] = await Promise.all([
          filterService.getSources(),
          filterService.getCategories(),
          filterService.getAuthors(),
          preferencesService.getPreferences()
        ]);

        setAvailableSources(sourcesData.sources);
        setAvailableCategories(categoriesData.categories);
        setAvailableAuthors(authorsData.authors);
        
        // Update preferences with saved data
        if (savedPreferences.preferences) {
          const parsed = JSON.parse(savedPreferences.preferences);
          setPreferences({
            sources: parsed.sources || [],
            categories: parsed.categories || [],
            authors: parsed.authors || []
          });
        }
      } catch (error) {
        console.error('Error loading preferences options:', error);
        toast.error('Failed to load preferences. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await preferencesService.savePreferences(preferences);
      onSave(preferences);
      onClose();
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    }
  };

  if (!isOpen) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <p>Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">News Preferences</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sources</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableSources.map((source) => (
                <label key={source} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.sources.includes(source)}
                    onChange={(e) => {
                      const newSources = e.target.checked
                        ? [...preferences.sources, source]
                        : preferences.sources.filter((s) => s !== source);
                      setPreferences({ ...preferences, sources: newSources });
                    }}
                    className="rounded text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.categories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...preferences.categories, category]
                        : preferences.categories.filter((c) => c !== category);
                      setPreferences({ ...preferences, categories: newCategories });
                    }}
                    className="rounded text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableAuthors.map((author) => (
                <label key={author} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.authors?.includes(author)}
                    onChange={(e) => {
                      const newAuthors = e.target.checked
                        ? [...(preferences.authors || []), author]
                        : (preferences.authors || []).filter((a) => a !== author);
                      setPreferences({ ...preferences, authors: newAuthors });
                    }}
                    className="rounded text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{author}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}