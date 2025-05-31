import React, { useEffect, useState } from 'react';
import { supabase, Release } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [editingRelease, setEditingRelease] = useState<Partial<Release> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (session) fetchReleases();

    return () => subscription.unsubscribe();
  }, [session]);

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

  async function handleSave(release: Partial<Release>) {
    const { data, error } = await supabase
      .from('releases')
      .upsert({
        id: release.id,
        title: release.title,
        date: release.date,
        description: release.description,
        status: 'Beta',
        documentation: release.documentation,
      })
      .select();

    if (error) {
      console.error('Error saving release:', error);
    } else {
      fetchReleases();
      setEditingRelease(null);
      setIsCreating(false);
    }
  }

  async function handleDelete(id: number) {
    const { error } = await supabase
      .from('releases')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting release:', error);
    } else {
      fetchReleases();
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
            className="w-full bg-[#333] text-white px-4 py-2 rounded-lg hover:bg-[#444] transition-colors"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingRelease({
                  title: '',
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  status: 'Beta',
                  documentation: '',
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Release
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {(editingRelease || isCreating) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                    value={editingRelease.title}
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
                    value={editingRelease.date}
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
                    value={editingRelease.description}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, description: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Documentation (Markdown)
                  </label>
                  <textarea
                    value={editingRelease.documentation}
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
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {releases.map((release) => (
                <tr key={release.id}>
                  <td className="px-6 py-4 text-white">{release.title}</td>
                  <td className="px-6 py-4 text-gray-300">{release.date}</td>
                  <td className="px-6 py-4 text-gray-300">{release.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingRelease(release)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(release.id)}
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