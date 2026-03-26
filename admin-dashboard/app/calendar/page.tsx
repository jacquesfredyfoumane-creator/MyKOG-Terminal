'use client';

import { useState, useEffect } from 'react';
import { calendarApi } from '@/lib/api/calendar';
import { CalendarEvent } from '@/types';
import CalendarForm from '@/components/CalendarForm';
import CalendarList from '@/components/CalendarList';
import ConnectionStatus from '@/components/ConnectionStatus';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarApi.getAll();
      // Trier par date de début
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      });
      setEvents(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async () => {
    await loadEvents();
    setShowForm(false);
    setEditingEvent(undefined);
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await calendarApi.delete(id);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(undefined);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
            <p className="text-gray-600 mt-1">
              Gérez le calendrier annuel de l'église
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ConnectionStatus />
            <button
              onClick={() => {
                setEditingEvent(undefined);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <PlusIcon className="w-5 h-5" />
              Nouvel événement
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="mb-6">
          <CalendarForm
            event={editingEvent}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Liste des événements */}
      {!showForm && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Événements ({events.length})
            </h2>
          </div>
          <CalendarList
            events={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}

