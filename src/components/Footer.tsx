import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <div className="flex items-center">
              <img src="/airship-logo-icon.png" alt="Airship Logo" className="h-8 brightness-0 invert" />
              <span className="ml-2 text-xl font-semibold">Airship Beta</span>
            </div>
            <p className="mt-4 text-gray-400">
              Early access to the future of customer engagement
            </p>
          </div>
          
          <div className="mt-8 md:mt-0">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-400 hover:text-[#0052FF]">Legal</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0052FF]">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Airship. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;