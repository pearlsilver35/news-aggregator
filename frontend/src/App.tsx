import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import Filters from './components/Filters';
import PreferencesModal from './components/PreferencesModal';
import { Article, SearchFilters, User } from './types';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { authService } from './services/auth';
import { Toaster } from 'react-hot-toast';
import { articleService, PaginatedResponse } from './services/articleService';
import Footer from './components/Footer';
import { User as UserIcon, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Article>, 'data'> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ keyword: '' });
  const [showPreferences, setShowPreferences] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Only try to get current user if we have a token
    if (authService.isAuthenticated()) {
      authService.getCurrentUser()
        .then(setUser)
        .catch(() => {
          setUser(null);
          // If getCurrentUser fails, we'll already have removed the token in the service
        });
    }
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    await authService.login(credentials);
    setShowLogin(false);
    const user = await authService.getCurrentUser();
    setUser(user);

  };

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    await authService.register(data);
    setShowRegister(false);
    const user = await authService.getCurrentUser();
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePreferencesSave = (preferences: User['preferences']) => {
    if (user) {
      setUser({ ...user, preferences });
    }
  };

  const fetchArticles = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await articleService.getArticles(page, filters);
      setArticles(response.data);
      setPagination(response);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, filters, user, fetchArticles]); // Added fetchArticles

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (keyword: string) => {
    setFilters(prev => ({ ...prev, keyword }));
    setCurrentPage(1); // Reset to first page when searching
  };

  const isFilterActive = filters.keyword || showFilters;

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <Header
          user={user}
          onLogin={() => setShowLogin(true)}
          onRegister={() => setShowRegister(true)}
          onLogout={handleLogout}
          onSearch={handleSearch}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {showFilters && <Filters onFilterChange={handleFilterChange} />}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {!isFilterActive ? (
                <>
                  {articles.length > 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        {articles.length > 0 && (
                          <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.img
                              src={articles[0].image_url}
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
                                <a
                                  href={articles[0].source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Read More
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="md:col-span-1">
                        <div className="border-b border-gray-200 mb-6">
                          <h2 className="text-xl font-bold pb-2">Top Story</h2>
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
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-48 object-cover rounded"
                                whileHover={{ scale: 1.05 }}
                              />
                              <a
                                href={articles[0].source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-3xl font-bold hover:text-blue-600"
                              >
                                <h3 className="font-semibold text-lg hover:text-blue-600">
                                  {article.title}
                                </h3>
                              </a>
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
                                src={article.image_url}
                                alt={article.title}
                                className="w-20 h-20 object-cover rounded flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                              />
                              <div>
                                <a
                                  href={articles[0].source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-3xl font-bold hover:text-blue-600"
                                >
                                  <h3 className="font-medium text-base hover:text-blue-600 line-clamp-2">
                                    {article.title}
                                  </h3>
                                </a>
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
                  ) : (
                    <div className="max-w-3xl mx-auto">
                      {articles.length === 1 && (
                        <ArticleCard article={articles[0]} />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}

              {pagination && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    {pagination.current_page > 1 && (
                      <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
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
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        className="px-3 py-1 rounded border hover:bg-gray-100"
                      >
                        Next
                      </button>
                    )}
                  </nav>
                </div>
              )}
            </>
          )}
        </main>

        {user && (
          <PreferencesModal
            user={user}
            isOpen={showPreferences}
            onClose={() => setShowPreferences(false)}
            onSave={handlePreferencesSave}
          />
        )}

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />

        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
      <Footer />
    </>
  );
}

export default App;