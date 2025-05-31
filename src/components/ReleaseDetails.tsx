import React, { useEffect, useState } from 'react';
import { supabase, Release } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

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
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .eq('id', releaseId)
      .single();

    if (error) {
      console.error('Error fetching release:', error);
    } else {
      setRelease(data);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <a
          href={basePath}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Releases
        </a>

        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-4">{release.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {release.date}
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-400" />
              <span className="px-3 py-1 text-sm rounded-full bg-blue-900 text-blue-300">
                Beta
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-lg mb-8">{release.description}</p>
            <div className="border-t border-gray-700 pt-8">
              <ReactMarkdown>{release.documentation}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReleaseDetails