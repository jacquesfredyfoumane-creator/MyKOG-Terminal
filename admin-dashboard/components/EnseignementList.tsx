'use client';

import { useState, useEffect, useRef } from 'react';
import { Enseignement } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { EllipsisVerticalIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { enseignementsApi } from '@/lib/api/enseignements';
import EnseignementEditForm from './EnseignementEditForm';

interface EnseignementListProps {
  enseignements: Enseignement[];
  onRefresh: () => void;
  viewMode?: 'list' | 'grid';
}

export default function EnseignementList({ enseignements, onRefresh, viewMode = 'list' }: EnseignementListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await enseignementsApi.delete(id);
      await onRefresh();
    } catch (error) {
      alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setOpenMenuId(null);
  };

  const handleEditSuccess = async () => {
    setEditingId(null);
    await onRefresh();
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  if (enseignements.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Aucun enseignement publié pour le moment.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enseignements.map((enseignement) => (
          <div key={enseignement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {enseignement.artworkUrl && (
              <img
                src={enseignement.artworkUrl}
                alt={enseignement.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {enseignement.title}
                </h3>
                <div className="relative" ref={(el) => { if (enseignement.id) menuRefs.current[enseignement.id] = el; }}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === enseignement.id ? null : enseignement.id || null)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={deletingId === enseignement.id}
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                    {openMenuId === enseignement.id && enseignement.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={() => handleEdit(enseignement.id!)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDelete(enseignement.id!, enseignement.title)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          disabled={deletingId === enseignement.id}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>{deletingId === enseignement.id ? 'Suppression...' : 'Supprimer'}</span>
                        </button>
                      </div>
                    )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Orateur:</span> {enseignement.speaker}
              </p>
              {enseignement.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{enseignement.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {enseignement.category}
                </span>
                {enseignement.typeCulte && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {enseignement.typeCulte}
                  </span>
                )}
                {enseignement.isNew && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    Nouveau
                  </span>
                )}
              </div>
              {enseignement.publishedAt && (
                <p className="text-xs text-gray-500">
                  {format(new Date(enseignement.publishedAt), 'dd MMM yyyy', { locale: fr })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Trouver l'enseignement en cours d'édition
  const editingEnseignement = editingId 
    ? enseignements.find(e => e.id === editingId)
    : null;

  if (editingEnseignement) {
    return (
      <div className="mb-6">
        <EnseignementEditForm
          enseignement={editingEnseignement}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Enseignements publiés ({enseignements.length})
          </h2>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {enseignements.map((enseignement) => (
          <div key={enseignement.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              {enseignement.artworkUrl && (
                <img
                  src={enseignement.artworkUrl}
                  alt={enseignement.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {enseignement.title}
                      </h3>
                      {enseignement.isNew && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                          Nouveau
                        </span>
                      )}
                      {enseignement.isFeatured && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          Mis en avant
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Orateur:</span> {enseignement.speaker}
                    </p>
                    {enseignement.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{enseignement.description}</p>
                    )}
                  </div>
                  <div className="relative ml-4" ref={(el) => { if (enseignement.id) menuRefs.current[enseignement.id] = el; }}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === enseignement.id ? null : enseignement.id || null)}
                      className="text-gray-400 hover:text-gray-600"
                      disabled={deletingId === enseignement.id}
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                    {openMenuId === enseignement.id && enseignement.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={() => handleEdit(enseignement.id!)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDelete(enseignement.id!, enseignement.title)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          disabled={deletingId === enseignement.id}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>{deletingId === enseignement.id ? 'Suppression...' : 'Supprimer'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {enseignement.category}
                  </span>
                  {enseignement.typeCulte && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {enseignement.typeCulte}
                    </span>
                  )}
                  {enseignement.duration && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {Math.floor(enseignement.duration / 60)} min
                    </span>
                  )}
                  {enseignement.tags && enseignement.tags.length > 0 && (
                    <>
                      {enseignement.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
                {enseignement.publishedAt && (
                  <p className="text-xs text-gray-500">
                    Publié le {format(new Date(enseignement.publishedAt), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
