import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <img src="/airship-logo-icon.png" alt="Airship Logo" className="h-8" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Airship Beta</span>
          </div>
          
          <div className="hidden md:flex items-center">
            <a href="#" className="bg-[#0052FF] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Request Access
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 bg-[#0052FF] text-white rounded-lg text-center mt-4">
              Request Access
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;