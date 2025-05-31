import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gray-900 min-h-[80vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 opacity-20" />
      
      {/* Particle effect background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSI1MCUiIHkxPSIwJSIgeDI9IjUwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMTQ0MCAyMDBzLTI4OC41IDk1LTcyMCA5NVMwIDIwMCAwIDIwMHY0NTFoMTQ0MFYyMDB6IiBmaWxsPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-8">
            Experience Tomorrow's
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Customer Engagement
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with Airship Beta. Get early access to our latest features 
            and help shape the future of cross-channel customer experiences.
          </p>
          
          <div className="mt-10 flex justify-center">
            <a
              href="#latest-releases"
              className="group relative inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Explore Latest Features
              <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;