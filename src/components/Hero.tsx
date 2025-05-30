import React from 'react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0052FF] via-[#0052FF] to-[#00D4FF]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSI1MCUiIHkxPSIwJSIgeDI9IjUwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMTQ0MCAyMDBzLTI4OC41IDk1LTcyMCA5NVMwIDIwMCAwIDIwMHY0NTFoMTQ0MFYyMDB6IiBmaWxsPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-8">
            Early Access to the Future
            <br />
            <span className="text-blue-100">of Customer Engagement</span>
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with Airship Beta. Get early access to our latest features 
            and help shape the future of cross-channel customer experiences.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="#latest-releases"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg"
            >
              View Latest Releases
            </a>
            <a
              href="#"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-lg"
            >
              Request Access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;