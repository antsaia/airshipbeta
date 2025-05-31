import React, { useEffect, useState } from 'react';
import { getReleaseById, updateRelease, addRelease, Release } from '../lib/db';
import { ArrowLeft, Save, Plus, Trash, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EditReleaseProps {
  releaseId?: number;
}

const EditRelease: React.FC<EditReleaseProps> = ({ releaseId }) => {
  const [release, setRelease] = useState<Partial<Release>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'Beta',
    documentation: '',
    screenshots: []
  });
  const [loading, setLoading] = useState(true);
  const basePath = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL;

  useEffect(() => {
    if (releaseId) {
      fetchRelease();
    } else {
      setLoading(false);
    }
  }, [releaseId]);

  async function fetchRelease() {
    try {
      const data = await getReleaseById(releaseId!);
      if (data) {
        setRelease(data);
      }
    } catch (error) {
      console.error('Error fetching release:', error);
    }
    setLoading(false);
  }

  function handleAddScreenshot() {
    const screenshots = release.screenshots || [];
    setRelease({
      ...release,
      screenshots: [...screenshots, { url: '', caption: '' }]
    });
  }

  function handleRemoveScreenshot(index: number) {
    const screenshots = [...(release.screenshots || [])];
    screenshots.splice(index, 1);
    setRelease({
      ...release,
      screenshots
    });
  }

  function handleScreenshotChange(index: number, field: 'url' | 'caption' | 'file', value: string | File) {
    const screenshots = [...(release.screenshots || [])];
    if (field === 'file' && value instanceof File) {
      screenshots[index] = {
        ...screenshots[index],
        file: value,
        url: URL.createObjectURL(value)
      };
    } else if (typeof value === 'string') {
      screenshots[index] = {
        ...screenshots[index],
        [field]: value
      };
    }
    setRelease({
      ...release,
      screenshots
    });
  }

  async function handleSave() {
    try {
      if (releaseId) {
        await updateRelease(release as Release);
      } else {
        await addRelease({
          title: release.title || '',
          date: release.date || new Date().toISOString().split('T')[0],
          description: release.description || '',
          status: 'Beta',
          documentation: release.documentation || '',
          screenshots: release.screenshots || []
        });
      }
      window.location.href = `${basePath}admin`;
    } catch (error) {
      console.error('Error saving release:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <a
              href={`${basePath}admin`}
              className="text-blue-400 hover:text-blue-300 mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </a>
            <h1 className="text-3xl font-bold text-white">
              {releaseId ? 'Edit Release' : 'New Release'}
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={release.title || ''}
                onChange={(e) => setRelease({ ...release, title: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={release.date || ''}
                onChange={(e) => setRelease({ ...release, date: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={release.description || ''}
                onChange={(e) => setRelease({ ...release, description: e.target.value })}
                rows={3}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Screenshots
                </label>
                <button
                  onClick={handleAddScreenshot}
                  className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Screenshot
                </button>
              </div>
              <div className="space-y-4">
                {release.screenshots?.map((screenshot, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">Screenshot {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveScreenshot(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={screenshot.url}
                          onChange={(e) => handleScreenshotChange(index, 'url', e.target.value)}
                          className="flex-1 bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <label className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500 cursor-pointer flex items-center">
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleScreenshotChange(index, 'file', file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Caption"
                        value={screenshot.caption}
                        onChange={(e) => handleScreenshotChange(index, 'caption', e.target.value)}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                      />
                      {screenshot.url && (
                        <img
                          src={screenshot.url}
                          alt={screenshot.caption}
                          className="w-full h-48 object-cover rounded mt-2"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Documentation (Markdown)
              </label>
              <textarea
                value={release.documentation || ''}
                onChange={(e) => setRelease({ ...release, documentation: e.target.value })}
                rows={10}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg font-mono"
              />
              {release.documentation && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{release.documentation}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRelease;