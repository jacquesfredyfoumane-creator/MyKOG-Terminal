'use client';

import { CalendarEvent } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

interface CalendarListProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function CalendarList({
  events,
  onEdit,
  onDelete,
  loading,
}: CalendarListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-600">Aucun événement dans le calendrier</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const startDate = new Date(event.startDate);
        const endDate = event.endDate ? new Date(event.endDate) : null;
        const eventColor = event.color || '#d4af37';

        return (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: eventColor }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="ml-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Date:</span>
                    <span>
                      {format(startDate, 'EEEE d MMMM yyyy', { locale: fr })}
                      {!event.isAllDay &&
                        ` à ${format(startDate, 'HH:mm', { locale: fr })}`}
                      {endDate &&
                        ` - ${format(endDate, 'd MMMM yyyy', { locale: fr })}`}
                      {endDate &&
                        !event.isAllDay &&
                        ` à ${format(endDate, 'HH:mm', { locale: fr })}`}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Lieu:</span>
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.category && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Catégorie:</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                        {event.category}
                      </span>
                    </div>
                  )}

                  {event.isAllDay && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      Journée entière
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Modifier"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Êtes-vous sûr de vouloir supprimer "${event.title}" ?`
                      )
                    ) {
                      onDelete(event.id!);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Supprimer"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

