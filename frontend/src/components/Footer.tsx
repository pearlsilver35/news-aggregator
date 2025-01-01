import React from 'react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Logo className="h-8 w-auto mb-4" />
            <p className="text-sm text-gray-500">
              Your trusted source for the latest news and articles from around the world.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Technology</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Business</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Science</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Health</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">About Us</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} News Aggregator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 