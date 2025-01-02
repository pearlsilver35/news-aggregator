import React, { useState, useCallback } from 'react';
import { User as UserIcon, Settings as SettingsIcon, LogOut as LogOutIcon, Search, SlidersHorizontal, Menu } from 'lucide-react';
import { User } from '../types';
import { debounce } from 'lodash';
import { Tooltip } from './ui/tooltip';
import { Button } from './ui/button';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import PreferencesModal from './PreferencesModal';
import Logo from './Logo';

interface HeaderProps {
  user: User | null;
  onLogin: (credentials: { email: string; password: string }) => void;
  onRegister: () => void;
  onLogout: () => void;
  onSearch: (keyword: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  onPreferencesSave: (preferences: User['preferences']) => void;
}

export default function Header({
  user,
  onLogin,
  onRegister,
  onLogout,
  onSearch,
  showFilters = false,
  onToggleFilters,
  onPreferencesSave
}: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handlePreferencesSave = (newPreferences: User['preferences']) => {
    // Handle preferences save if needed
    setShowPreferences(false);
  };

  return (
    <header className="border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-8">
        <Logo className="h-4 sm:h-8 w-auto flex-shrink-0" />

        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search articles..."
            className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Tooltip content="Filters">
            <button
              onClick={onToggleFilters}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 ${showFilters ? 'text-blue-500' : 'text-gray-400'
                }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>

        <div className="relative w-full sm:hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onToggleFilters}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 ${showFilters ? 'text-blue-500' : 'text-gray-400'
              }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{user.name}</span>
              </div>

              <Tooltip content="Preferences">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </Tooltip>

              <Tooltip content="Logout">
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <LogOutIcon className="w-5 h-5" />
                </button>
              </Tooltip>
            </>
          ) : (
            <Button variant="primary" onClick={() => setShowLoginModal(true)}>
              Login
            </Button>
          )}
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-full"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {showMobileMenu && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
          <div className="p-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setShowPreferences(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                >
                  <LogOutIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  setShowLoginModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={onLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={onRegister}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      {user && (
        <PreferencesModal
          user={user}
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          onSave={onPreferencesSave}
        />
      )}
    </header>
  );
}