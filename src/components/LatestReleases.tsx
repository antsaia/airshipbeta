import React from 'react';

const releases = [
  {
    title: 'Enhanced Push Notifications',
    date: 'March 2024',
    description: 'Improved delivery rates and new targeting options for mobile push notifications.',
    status: 'Beta',
    link: '#'
  },
  {
    title: 'Analytics Dashboard 2.0',
    date: 'February 2024',
    description: 'Completely redesigned analytics dashboard with real-time metrics and custom reports.',
    status: 'Alpha',
    link: '#'
  },
  {
    title: 'Message Templates API',
    date: 'January 2024',
    description: 'New API endpoints for managing and deploying message templates programmatically.',
    status: 'Beta',
    link: '#'
  }
];

const LatestReleases = () => {
  return (
    <div id="latest-releases" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Releases</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {releases.map((release, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{release.title}</h3>
              <span className={`px-3 py-1 text-sm rounded-full ${
                release.status === 'Beta' ? 'bg-blue-100 text-[#0052FF]' : 'bg-purple-100 text-purple-800'
              }`}>
                {release.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{release.date}</p>
            <p className="mt-4 text-gray-600 leading-relaxed">{release.description}</p>
            <a
              href={release.link}
              className="mt-6 inline-flex items-center text-[#0052FF] hover:text-blue-700 font-medium"
            >
              Learn more
              <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestReleases;