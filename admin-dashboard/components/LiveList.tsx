'use client';

import { LiveStream } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { livesApi } from '@/lib/api/lives';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface LiveListProps {
  lives: LiveStream[];
  onRefresh: () => void;
}

export default function LiveList({ lives, onRefresh }: LiveListProps) {
  const handleStatusChange = async (id: string, newStatus: 'scheduled' | 'live' | 'ended') => {
    try {
      await livesApi.updateStatus(id, newStatus);
      onRefresh();
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce live ?')) {
      return;
    }
    try {
      await livesApi.delete(id);
      onRefresh();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live':
        return 'En direct';
      case 'scheduled':
        return 'Programmé';
      case 'ended':
        return 'Terminé';
      default:
        return status;
    }
  };

  if (lives.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Aucun live stream pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          Live streams ({lives.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {lives.map((live) => (
          <div key={live.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              {live.thumbnailUrl && (
                <img
                  src={live.thumbnailUrl}
                  alt={live.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {live.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(live.status || 'scheduled')}`}>
                        {getStatusLabel(live.status || 'scheduled')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Pasteur:</span> {live.pastor}
                    </p>
                    {live.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{live.description}</p>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 ml-4">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  {live.streamUrl && (
                    <p><span className="font-medium">Stream URL:</span> <span className="font-mono text-xs break-all">{live.streamUrl}</span></p>
                  )}
                  {live.viewerCount !== undefined && (
                    <p><span className="font-medium">Viewers:</span> {live.viewerCount} {live.peakViewerCount && `(Pic: ${live.peakViewerCount})`}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {live.tags && live.tags.length > 0 && (
                    <>
                      {live.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {live.scheduledAt && (
                    <p>Programmé le {format(new Date(live.scheduledAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                  )}
                  {live.startedAt && (
                    <p>Démarré le {format(new Date(live.startedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                  )}
                  {live.endedAt && (
                    <p>Terminé le {format(new Date(live.endedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                  )}
                </div>
                <div className="mt-4 flex space-x-2">
                  {live.status !== 'live' && (
                    <button
                      onClick={() => live.id && handleStatusChange(live.id, 'live')}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Démarrer
                    </button>
                  )}
                  {live.status === 'live' && (
                    <button
                      onClick={() => live.id && handleStatusChange(live.id, 'ended')}
                      className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Terminer
                    </button>
                  )}
                  {live.id && (
                    <button
                      onClick={() => handleDelete(live.id!)}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
