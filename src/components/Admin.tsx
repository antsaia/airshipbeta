import React, { useEffect, useState } from 'react';
import { getAllReleases, Release } from '../lib/db';
import { Plus, Edit, Trash, Image } from 'lucide-react';

const Admin = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const basePath = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL;

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

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this release?')) {
      try {
        await deleteRelease(id);
        fetchReleases();
      } catch (error) {
        console.error('Error deleting release:', error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <a
            href={`${basePath}admin/new`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Release
          </a>
        </div>

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
                    <a
                      href={`${basePath}admin/edit/${release.id}`}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </a>
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