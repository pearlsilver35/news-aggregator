import { useState, useEffect } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import PreferencesModal from './components/PreferencesModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { ArticleLayout } from './components/ArticleLayout';
import { Pagination } from './components/Pagination';
import { useAuth } from './hooks/useAuth';
import { useArticles } from './hooks/useArticles';
import { User } from './types';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ArticleDetail } from './pages/ArticleDetail';

function App() {
  const location = useLocation();
  const isArticleDetail = location.pathname.includes('/articles/');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    user,
    setUser,
    handleLogin,
    handleRegister,
    handleLogout
  } = useAuth();

  const {
    articles,
    pagination,
    currentPage,
    isLoading,
    filters,
    fetchArticles,
    handleFilterChange,
    handleSearch,
    handleResetFilters,
    handlePageChange
  } = useArticles();

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, filters, user, fetchArticles]);

  const handlePreferencesSave = (preferences: User['preferences']) => {
    if (user) {
      setUser({ ...user, preferences });
      fetchArticles(1);
    }
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const isFilterActive = filters.keyword || showFilters;

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <Header
          user={user}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
          onSearch={handleSearch}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onPreferencesSave={handlePreferencesSave}
          hideSearch={isArticleDetail}
        />

        <Routes>
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route
            path="/"
            element={
              <>
                {showFilters && (
                  <Filters 
                    onFilterChange={handleFilterChange} 
                    selectedFilters={filters} 
                    onResetFilters={handleResetFilters} 
                  />
                )}

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <>
                      <ArticleLayout 
                        articles={articles} 
                        isFilterActive={isFilterActive}
                        onRefresh={() => {
                          handleResetFilters();
                          fetchArticles(1);
                        }}
                      />

                      {pagination && (
                        <Pagination 
                          pagination={pagination}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </>
                  )}
                </main>
              </>
            }
          />
        </Routes>

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