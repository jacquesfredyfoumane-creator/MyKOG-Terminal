'use client';

import { useState, useEffect } from 'react';
import { calendarApi } from '@/lib/api/calendar';
import { CalendarEvent } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CalendarFormProps {
  event?: CalendarEvent;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CalendarForm({ event, onSubmit, onCancel }: CalendarFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    category: 'Culte',
    color: '#d4af37',
    isAllDay: false,
  });

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : null;
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startDate: startDate.toISOString().split('T')[0],
        startTime: event.isAllDay ? '' : startDate.toTimeString().slice(0, 5),
        endDate: endDate ? endDate.toISOString().split('T')[0] : '',
        endTime: endDate && !event.isAllDay ? endDate.toTimeString().slice(0, 5) : '',
        location: event.location || '',
        category: event.category || 'Culte',
        color: event.color || '#d4af37',
        isAllDay: event.isAllDay || false,
        hasAlarm: event.hasAlarm || false,
        alarmDaysBefore: event.alarmDaysBefore || 0,
        alarmHoursBefore: event.alarmHoursBefore || 0,
        alarmMinutesBefore: event.alarmMinutesBefore || 15,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Construire les dates complètes
      const startDateTime = formData.isAllDay
        ? new Date(formData.startDate)
        : new Date(`${formData.startDate}T${formData.startTime}`);
      
      const endDateTime = formData.endDate
        ? (formData.isAllDay
            ? new Date(formData.endDate)
            : new Date(`${formData.endDate}T${formData.endTime || formData.startTime}`))
        : undefined;

      const eventData: CalendarEvent = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime?.toISOString(),
        location: formData.location || undefined,
        category: formData.category || undefined,
        color: formData.color,
        isAllDay: formData.isAllDay,
        hasAlarm: formData.hasAlarm,
        alarmDaysBefore: formData.hasAlarm ? formData.alarmDaysBefore : undefined,
        alarmHoursBefore: formData.hasAlarm ? formData.alarmHoursBefore : undefined,
        alarmMinutesBefore: formData.hasAlarm ? formData.alarmMinutesBefore : undefined,
      };

      if (event?.id) {
        await calendarApi.update(event.id, eventData);
      } else {
        await calendarApi.create(eventData);
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        category: 'Culte',
        color: '#d4af37',
        isAllDay: false,
      });
      
      setTimeout(() => {
        onSubmit();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Culte', 'Réunion', 'Événement', 'Formation', 'Prière', 'Autre'];
  const colors = [
    { name: 'Or', value: '#d4af37' },
    { name: 'Bleu', value: '#3b82f6' },
    { name: 'Vert', value: '#10b981' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Rose', value: '#ec4899' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {event ? 'Modifier l\'événement' : 'Nouvel événement'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {event ? 'Événement modifié avec succès !' : 'Événement créé avec succès !'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Culte du dimanche"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description de l'événement..."
          />
        </div>

        {/* Date de début */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {!formData.isAllDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Date de fin */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {!formData.isAllDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de fin
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Journée entière */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAllDay"
            checked={formData.isAllDay}
            onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isAllDay" className="ml-2 text-sm text-gray-700">
            Journée entière
          </label>
        </div>

        {/* Lieu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Église KOG, Salle principale"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Couleur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Couleur
          </label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: color.value })}
                className={`w-10 h-10 rounded-lg border-2 ${
                  formData.color === color.value
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Système d'alarme */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="hasAlarm"
              checked={formData.hasAlarm}
              onChange={(e) => setFormData({ ...formData, hasAlarm: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasAlarm" className="ml-2 text-sm font-medium text-gray-700">
              Activer l'alarme pour cet événement
            </label>
          </div>

          {formData.hasAlarm && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                L'alarme se déclenchera avant le début de l'événement selon les paramètres ci-dessous :
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Jours avant
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.alarmDaysBefore}
                    onChange={(e) => setFormData({ ...formData, alarmDaysBefore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Heures avant
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.alarmHoursBefore}
                    onChange={(e) => setFormData({ ...formData, alarmHoursBefore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Minutes avant
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.alarmMinutesBefore}
                    onChange={(e) => setFormData({ ...formData, alarmMinutesBefore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="15"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Exemple : 1 jour, 2 heures et 15 minutes avant = l'alarme sonnera 1 jour, 2 heures et 15 minutes avant le début de l'événement.
              </p>
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Enregistrement...' : event ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}

