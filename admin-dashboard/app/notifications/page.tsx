'use client';

import { useState } from 'react';
import { notificationsApi, NotificationPayload } from '@/lib/api/notifications';
import ConnectionStatus from '@/components/ConnectionStatus';
import { BellIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<NotificationPayload>({
    title: '',
    body: '',
    type: 'general',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await notificationsApi.sendToAll(formData);
      setSuccess(
        `Notification envoyée avec succès ! ${response.sent} utilisateurs notifiés (${response.failed} échecs sur ${response.total})`
      );
      setFormData({
        title: '',
        body: '',
        type: 'general',
        imageUrl: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications Push</h1>
            <p className="text-gray-600 mt-1">
              Envoyer des notifications push à tous les utilisateurs de l'application
            </p>
          </div>
          <ConnectionStatus />
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <BellIcon className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Nouvelle notification</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Nouvel enseignement disponible"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="body"
              id="body"
              value={formData.body}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Ex: Découvrez notre nouvel enseignement sur la foi..."
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type de notification
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="general">Général</option>
              <option value="calendar">Calendrier</option>
              <option value="teaching">Enseignement</option>
              <option value="live">Live</option>
              <option value="annonce">Annonce</option>
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL de l'image (optionnel)
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                Envoyer la notification
              </>
            )}
          </button>
        </form>
      </div>

      {/* Informations */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Informations</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Les notifications sont envoyées à tous les utilisateurs ayant activé les notifications</li>
          <li>Le type de notification détermine l'action effectuée lors du tap</li>
          <li>L'image sera affichée dans la notification si fournie</li>
          <li>Les notifications sont automatiquement envoyées lors de la création de contenu (calendrier, enseignements, annonces)</li>
        </ul>
      </div>
    </div>
  );
}

