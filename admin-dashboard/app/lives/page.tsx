'use client';

import { useState, useEffect } from 'react';
import { livesApi } from '@/lib/api/lives';
import { LiveStream } from '@/types';
import LiveForm from '@/components/LiveForm';
import LiveList from '@/components/LiveList';
import ConnectionStatus from '@/components/ConnectionStatus';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function LivesPage() {
  const [lives, setLives] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'full' | 'quick'>('quick'); // Mode rapide par défaut

  const loadLives = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await livesApi.getAll();
      setLives(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLives();
  }, []);

  const handleSubmit = async () => {
    await loadLives();
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lives</h1>
            <p className="text-gray-600 mt-1">
              Gérer les streams en direct
            </p>
          </div>
          <div className="flex space-x-2">
            {!showForm && (
              <>
                <button
                  onClick={() => {
                    setFormMode('quick');
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2 shadow-sm font-semibold"
                >
                  <span>🎥</span>
                  <span>Publier Live Facebook</span>
                </button>
                <button
                  onClick={() => {
                    setFormMode('full');
                    setShowForm(true);
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Nouveau live</span>
                </button>
              </>
            )}
            {showForm && (
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-600">
        <span className="hover:text-gray-900 cursor-pointer">Accueil</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Lives</span>
      </div>

      <ConnectionStatus />

      {showForm && (
        <div className="mb-6">
          <LiveForm onSubmit={handleSubmit} mode={formMode} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : (
        <LiveList lives={lives} onRefresh={loadLives} />
      )}
    </div>
  );
}
