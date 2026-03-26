'use client';

import { TextResume } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { EllipsisVerticalIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { textResumesApi } from '@/lib/api/textResumes';
import { useState } from 'react';

interface TextResumeListProps {
  textResumes: TextResume[];
  onRefresh: () => void;
  onEdit?: (textResume: TextResume) => void;
}

export default function TextResumeList({ textResumes, onRefresh, onEdit }: TextResumeListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce texte résumé ?')) {
      return;
    }

    setDeletingId(id);
    try {
      await textResumesApi.delete(id);
      onRefresh();
    } catch (error) {
      alert('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  if (textResumes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Aucun texte résumé publié pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Textes résumés publiés ({textResumes.length})
          </h2>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {textResumes.map((textResume) => (
          <div key={textResume.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              {textResume.coverImageUrl && (
                <img
                  src={textResume.coverImageUrl}
                  alt={textResume.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              {!textResume.coverImageUrl && (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">📄</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {textResume.title}
                      </h3>
                      {textResume.isNew && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                          Nouveau
                        </span>
                      )}
                      {textResume.isFeatured && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                          Mis en avant
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Orateur:</span> {textResume.speaker}
                    </p>
                    {textResume.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {textResume.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {textResume.category}
                      </span>
                      {textResume.typeCulte && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {textResume.typeCulte}
                        </span>
                      )}
                      {textResume.fileSize && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {(textResume.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                      {textResume.viewCount !== undefined && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          {textResume.viewCount} vues
                        </span>
                      )}
                    </div>
                    {textResume.publishedAt && (
                      <p className="text-xs text-gray-500">
                        Publié le {format(new Date(textResume.publishedAt), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {textResume.pdfUrl && (
                      <a
                        href={textResume.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Voir PDF
                      </a>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(textResume)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => textResume.id && handleDelete(textResume.id)}
                      disabled={deletingId === textResume.id}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

