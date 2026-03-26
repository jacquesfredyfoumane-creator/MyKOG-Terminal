'use client';

import { Annonce } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface AnnonceListProps {
  annonces: Annonce[];
  onRefresh: () => void;
}

export default function AnnonceList({ annonces, onRefresh }: AnnonceListProps) {
  if (annonces.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Aucune annonce publiée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          Annonces publiées ({annonces.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {annonces.map((annonce) => (
          <div key={annonce.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {annonce.nom}
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
                  {annonce.description}
                </p>
                {annonce.dateCreation && (
                  <p className="text-xs text-gray-500">
                    Créée le {format(new Date(annonce.dateCreation), 'dd MMMM yyyy à HH:mm', { locale: fr })}
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
