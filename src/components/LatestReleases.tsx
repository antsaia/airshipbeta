import React, { useEffect, useState } from 'react';
import { supabase, Release } from '../lib/supabase';
import { ArrowRight, Sparkles } from 'lucide-react';

const LatestReleases = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const basePath = import.meta.env.BASE_URL;

  useEffect(() => {
    fetchReleases();
  }, []);

  async function fetchReleases() {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching releases:', error);
    } else {
      setReleases(data || []);
    }
  }

  return (
    <div id="latest-releases" className="relative bg-gray-900 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSI1MCUiIHkxPSIwJSIgeDI9IjUwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMTQ0MCAyMDBzLTI4OC41IDk1LTcyMCA5NVMwIDIwMCAwIDIwMHY0NTFoMTQ0MFYyMDB6IiBmaWxsPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="flex items-center mb-12">
          <Sparkles className="w-8 h-8 text-blue-400 mr-4" />
          <h2 className="text-3xl font-bold text-white">Latest Beta Releases</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {releases.map((release) => (
            <a
              key={release.id}
              href={`${basePath}releases/${release.id}`}
              className="group bg-gray-800 backdrop-blur-lg bg-opacity-50 rounded-xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300"
            >
              <div>
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {release.title}
                </h3>
              </div>
              <p className="text-sm text-gray-400 mt-2">{release.date}</p>
              <p className="mt-4 text-gray-300 leading-relaxed">{release.description}</p>
              <span
                className="mt-6 inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group-hover:translate-x-2 transition-transform"
              >
                Learn more
                <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LatestReleases