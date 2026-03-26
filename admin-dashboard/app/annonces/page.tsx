'use client';

import { useState, useEffect } from 'react';
import { annoncesApi } from '@/lib/api/annonces';
import { Annonce } from '@/types';
import AnnonceForm from '@/components/AnnonceForm';
import AnnonceList from '@/components/AnnonceList';
import ConnectionStatus from '@/components/ConnectionStatus';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadAnnonces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await annoncesApi.getAll();
      setAnnonces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnonces();
  }, []);

  const handleSubmit = async () => {
    await loadAnnonces();
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Annonces</h1>
            <p className="text-gray-600 mt-1">
              Créer et gérer les annonces
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            <span>{showForm ? 'Annuler' : 'Nouvelle annonce'}</span>
          </button>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-600">
        <span className="hover:text-gray-900 cursor-pointer">Accueil</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Annonces</span>
      </div>

      <ConnectionStatus />

      {showForm && (
        <div className="mb-6">
          <AnnonceForm onSubmit={handleSubmit} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : (
        <AnnonceList annonces={annonces} onRefresh={loadAnnonces} />
      )}
    </div>
  );
}
