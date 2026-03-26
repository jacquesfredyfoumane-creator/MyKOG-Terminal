'use client';

import { useState, useEffect } from 'react';
import { enseignementsApi } from '@/lib/api/enseignements';
import { Enseignement } from '@/types';
import EnseignementForm from '@/components/EnseignementForm';
import EnseignementList from '@/components/EnseignementList';
import ConnectionStatus from '@/components/ConnectionStatus';
import { PlusIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

export default function EnseignementsPage() {
  const [enseignements, setEnseignements] = useState<Enseignement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const loadEnseignements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await enseignementsApi.getAll();
      setEnseignements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnseignements();
  }, []);

  const handleSubmit = async () => {
    await loadEnseignements();
    setShowForm(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enseignements</h1>
            <p className="text-gray-600 mt-1">
              Publier des enseignements avec audio et image
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{showForm ? 'Annuler' : 'Nouvel enseignement'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <span className="hover:text-gray-900 cursor-pointer">Accueil</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Enseignements</span>
      </div>

      <ConnectionStatus />

      {showForm && (
        <div className="mb-6">
          <EnseignementForm onSubmit={handleSubmit} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : (
        <EnseignementList enseignements={enseignements} onRefresh={loadEnseignements} viewMode={viewMode} />
      )}
    </div>
  );
}
