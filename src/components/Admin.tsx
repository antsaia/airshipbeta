import React, { useEffect, useState } from 'react';
import { getAllReleases, addRelease, updateRelease, deleteRelease, Release } from '../lib/db';
import ReactMarkdown from 'react-markdown';
import { Plus, Edit, Trash, Save, X, Image, Upload } from 'lucide-react';

const Admin = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [editingRelease, setEditingRelease] = useState<Partial<Release> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchReleases();
  }, []);

  async function fetchReleases() {
    try {
      const data = await getAllReleases();
      setReleases(data || []);
    } catch (error) {
      console.error('Error fetching releases:', error);
    }
  }

  async function handleSave(release: Partial<Release>) {
    try {
      if (release.id) {
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
      fetchReleases();
      setEditingRelease(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving release:', error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteRelease(id);
      fetchReleases();
    } catch (error) {
      console.error('Error deleting release:', error);
    }
  }

  function handleAddScreenshot() {
    const screenshots = editingRelease?.screenshots || [];
    setEditingRelease({
      ...editingRelease,
      screenshots: [...screenshots, { url: '', caption: '' }]
    });
  }

  function handleRemoveScreenshot(index: number) {
    const screenshots = [...(editingRelease?.screenshots || [])];
    screenshots.splice(index, 1);
    setEditingRelease({
      ...editingRelease,
      screenshots
    });
  }

  function handleScreenshotChange(index: number, field: 'url' | 'caption' | 'file', value: string | File) {
    const screenshots = [...(editingRelease?.screenshots || [])];
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
    setEditingRelease({
      ...editingRelease,
      screenshots
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingRelease({
                title: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                status: 'Beta',
                documentation: '',
                screenshots: []
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Release
          </button>
        </div>

        {(editingRelease || isCreating) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {isCreating ? 'Create Release' : 'Edit Release'}
                </h2>
                <button
                  onClick={() => {
                    setEditingRelease(null);
                    setIsCreating(false);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingRelease.title || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, title: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingRelease.date || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, date: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingRelease.description || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, description: e.target.value })
                    }
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
                    {editingRelease.screenshots?.map((screenshot, index) => (
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
                    value={editingRelease.documentation || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, documentation: e.target.value })
                    }
                    rows={10}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg font-mono"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave(editingRelease)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Description</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-300">Screenshots</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {releases.map((release) => (
                <tr key={release.id}>
                  <td className="px-6 py-4 text-white">{release.title}</td>
                  <td className="px-6 py-4 text-gray-300">{release.date}</td>
                  <td className="px-6 py-4 text-gray-300">{release.description}</td>
                  <td className="px-6 py-4 text-center text-gray-300">
                    <span className="inline-flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      {release.screenshots?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingRelease(release)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => release.id && handleDelete(release.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;