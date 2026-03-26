'use client';

import { useState, useEffect } from 'react';
import { livesApi } from '@/lib/api/lives';
import { LiveStream } from '@/types';

interface LiveFormProps {
  onSubmit: () => void;
  mode?: 'full' | 'quick'; // Mode complet ou publication rapide
}

export default function LiveForm({ onSubmit, mode = 'full' }: LiveFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeLive, setActiveLive] = useState<LiveStream | null>(null);
  const [loadingActive, setLoadingActive] = useState(true);
  const [detectedServerIP, setDetectedServerIP] = useState<string>(''); // IP détectée automatiquement

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pastor: '',
    thumbnailUrl: '',
    streamUrl: '',
    streamKey: 'mykog_live', // Clé par défaut
    scheduledAt: '',
    tags: '',
    status: 'scheduled' as 'scheduled' | 'live' | 'ended',
    serverIP: '', // IP du serveur (optionnel, sera détectée automatiquement)
  });

  // Charger le live actif au démarrage (pour le mode rapide)
  useEffect(() => {
    if (mode === 'quick') {
      loadActiveLive();
    }
  }, [mode]);

  // Détecter automatiquement l'IP/URLs serveur (backend)
  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        // Utiliser l'URL du backend Node.js directement
        // Essayer d'abord avec la variable d'environnement, sinon utiliser l'IP par défaut
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.195:3000';
        const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
        const res = await fetch(`${apiUrl}/lives/server-info`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.serverIP) {
          setDetectedServerIP(data.serverIP);
          // Pré-remplir le champ IP s'il est vide
          setFormData((prev) => {
            if (prev.serverIP) return prev;
            return { ...prev, serverIP: data.serverIP };
          });
        }
      } catch (err) {
        console.error('Erreur récupération IP serveur:', err);
      }
    };

    fetchServerInfo();
  }, []); // une seule fois au montage

  const loadActiveLive = async () => {
    try {
      setLoadingActive(true);
      const live = await livesApi.getActive();
      if (live) {
        setActiveLive(live);
        // Pré-remplir le formulaire avec le live actif
        setFormData({
          title: live.title || '',
          description: live.description || '',
          pastor: live.pastor || '',
          thumbnailUrl: live.thumbnailUrl || '',
          streamUrl: live.streamUrl || '',
          streamKey: live.streamKey || 'mykog_live',
          scheduledAt: '',
          tags: live.tags?.join(', ') || '',
          status: live.status || 'live',
          serverIP: '',
        });
      }
    } catch (err) {
      console.error('Erreur chargement live actif:', err);
    } finally {
      setLoadingActive(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation côté client
    if (!formData.title || !formData.title.trim()) {
      setError('Le titre est requis');
      setLoading(false);
      return;
    }

    if (!formData.pastor || !formData.pastor.trim()) {
      setError('Le pasteur est requis');
      setLoading(false);
      return;
    }

    try {
      const dataToSend: any = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        pastor: formData.pastor.trim(),
        thumbnailUrl: formData.thumbnailUrl?.trim() || undefined,
        streamKey: formData.streamKey?.trim() || 'mykog_live',
        scheduledAt: formData.scheduledAt || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        // En mode rapide, forcer le statut à "live"
        status: mode === 'quick' ? 'live' as const : formData.status,
      };

      // Ajouter l'IP du serveur si fournie
      if (formData.serverIP && formData.serverIP.trim()) {
        dataToSend.serverIP = formData.serverIP.trim();
      }

      // Ne pas envoyer streamUrl - le backend le générera automatiquement
      // Le backend générera l'URL HLS à partir de la clé de stream
      
      console.log('📤 Données envoyées au backend:', JSON.stringify(dataToSend, null, 2));

      // Si un live actif existe, le mettre à jour, sinon en créer un nouveau
      if (activeLive?.id && mode === 'quick') {
        await livesApi.update(activeLive.id, dataToSend);
        setSuccess(true);
        setTimeout(() => {
          onSubmit();
        }, 1500);
      } else {
        await livesApi.create(dataToSend);
        setSuccess(true);
        
        // Reset form seulement si pas en mode rapide
        if (mode !== 'quick') {
          setFormData({
            title: '',
            description: '',
            pastor: '',
            thumbnailUrl: '',
            streamUrl: '',
            streamKey: '',
            scheduledAt: '',
            tags: '',
            status: 'scheduled',
          });
        }
        
        setTimeout(() => {
          onSubmit();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  // Mode publication rapide Facebook
  if (mode === 'quick') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg border-2 border-purple-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>🎥</span>
              <span>Publication Live Facebook</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Collez le lien du live Facebook et publiez instantanément
            </p>
          </div>
          {activeLive && (
            <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <span>LIVE ACTIF</span>
            </div>
          )}
        </div>

        {loadingActive ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Chargement du live actif...</p>
          </div>
        ) : (
          <>
            {activeLive && (
              <div className="mb-6 p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Live actuel:</span> {activeLive.title}
                </p>
                <p className="text-xs text-gray-500 font-mono break-all">
                  {activeLive.streamUrl}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                ✅ Live publié avec succès ! L'application va se mettre à jour automatiquement.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informations de connexion OBS */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                  <span>📡</span>
                  <span>Configuration OBS</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-blue-800">Clé de Stream:</span>
                    <input
                      type="text"
                      value={formData.streamKey}
                      onChange={(e) => setFormData({ ...formData, streamKey: e.target.value })}
                      className="ml-2 px-3 py-1.5 border border-blue-300 rounded bg-white font-mono text-xs w-48"
                      placeholder="mykog_live"
                    />
                  </div>
                  <div className="text-xs text-blue-700 mt-2">
                    <p className="font-semibold mb-1">URL RTMP pour OBS:</p>
                    <p className="font-mono bg-white px-2 py-1 rounded border border-blue-200 break-all">
                      rtmp://{formData.serverIP || detectedServerIP || 'localhost'}:1935/live/{formData.streamKey || 'mykog_live'}
                    </p>
                    <p className="mt-2 text-blue-600">
                      💡 L'URL HLS sera générée automatiquement après publication
                    </p>
                  </div>
                </div>
              </div>

              {/* IP du serveur (optionnel) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌐 IP du Serveur (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.serverIP}
                  onChange={(e) => setFormData({ ...formData, serverIP: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white font-mono text-sm"
                  placeholder="192.168.1.195 (laisser vide pour détection automatique)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'IP sera détectée automatiquement si laissée vide
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Titre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="Ex: Culte du Dimanche - 10h00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Pasteur
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pastor}
                    onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="Ex: Pasteur John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  placeholder="Description du live..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-purple-200">
                <button
                  type="button"
                  onClick={() => onSubmit()}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-2.5 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Publication...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Publier le Live</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    );
  }

  // Mode formulaire complet
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Nouveau live stream
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          Live stream créé avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              placeholder="Titre du live"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pasteur *
            </label>
            <input
              type="text"
              required
              value={formData.pastor}
              onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              placeholder="Nom du pasteur"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            placeholder="Description du live stream..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL du stream *
            </label>
            <input
              type="url"
              required
              value={formData.streamUrl}
              onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              placeholder="rtmp://... ou https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clé de stream
            </label>
            <input
              type="text"
              value={formData.streamKey}
              onChange={(e) => setFormData({ ...formData, streamKey: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              placeholder="Clé pour OBS"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la miniature
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date programmée
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="live, culte, prière"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onSubmit()}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? 'Publication...' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  );
}
