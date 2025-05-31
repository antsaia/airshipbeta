import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL;

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <a 
            href={basePath}
            className="flex items-center group"
          >
            <img 
              src={`${basePath}airship-logo-icon.png`}
              alt="Airship Beta Logo" 
              className="h-8 brightness-0 invert"
            />
            <span className="ml-2 text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              Airship Beta
            </span>
          </a>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;