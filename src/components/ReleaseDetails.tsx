import React, { useEffect, useState } from 'react';
import { getReleaseById, Release } from '../lib/db';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Tag, Sparkles } from 'lucide-react';

interface ReleaseDetailsProps {
  releaseId: number;
}

const ReleaseDetails: React.FC<ReleaseDetailsProps> = ({ releaseId }) => {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const basePath = import.meta.env.BASE_URL;

  useEffect(() => {
    fetchRelease();
  }, [releaseId]);

  async function fetchRelease() {
    setLoading(true);
    try {
      const data = await getReleaseById(releaseId);
      setRelease(data || null);
    } catch (error) {
      console.error('Error fetching release:', error);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Release Not Found</h2>
          <a
            href={basePath}
            className="text-blue-400 hover:text-blue-300 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0052FF] via-[#0052FF] to-[#00D4FF] opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <a
            href={basePath}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Releases
          </a>

          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <div className="p-8 md:p-12">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-500/10 rounded-full p-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-blue-900 text-blue-300">
                  Beta Release
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {release.title}
              </h1>
              
              <div className="flex items-center text-gray-400 mb-8">
                <Calendar className="w-4 h-4 mr-2" />
                {release.date}
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <div className="text-gray-300 text-lg leading-relaxed mb-12 border-b border-gray-700 pb-8">
                  {release.description}
                </div>
                
                <div className="pt-8">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
                      li: ({ children }) => <li className="text-gray-300">{children}</li>,
                    }}
                  >
                    {release.documentation}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReleaseDetails;