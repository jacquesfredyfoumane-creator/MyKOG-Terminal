'use client';

import { useState } from 'react';
import { textResumesApi } from '@/lib/api/textResumes';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TextResumeFormProps {
  onSubmit: () => void;
  initialData?: any;
}

export default function TextResumeForm({ onSubmit, initialData }: TextResumeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    speaker: initialData?.speaker || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Enseignement',
    tags: initialData?.tags?.join(', ') || '',
    mois: initialData?.mois || (new Date().getMonth() + 1),
    annee: initialData?.annee || new Date().getFullYear(),
    typeCulte: initialData?.typeCulte || 'Culte de Louange',
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!initialData && !pdfFile) {
      setError('Veuillez sélectionner un fichier PDF');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('speaker', formData.speaker);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('mois', formData.mois.toString());
      formDataToSend.append('annee', formData.annee.toString());
      formDataToSend.append('typeCulte', formData.typeCulte);

      if (pdfFile) {
        formDataToSend.append('pdf', pdfFile);
      }
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (initialData?.id) {
        await textResumesApi.update(initialData.id, formDataToSend);
      } else {
        await textResumesApi.create(formDataToSend);
      }

      setSuccess(true);
      
      if (!initialData) {
        // Reset form only for new entries
        setFormData({
          title: '',
          speaker: '',
          description: '',
          category: 'Enseignement',
          tags: '',
          mois: new Date().getMonth() + 1,
          annee: new Date().getFullYear(),
          typeCulte: 'Culte de Louange',
        });
        setPdfFile(null);
        setImageFile(null);
      }
      
      setTimeout(() => {
        onSubmit();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Modifier le texte résumé' : 'Nouveau texte résumé'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {initialData ? 'Texte résumé modifié avec succès !' : 'Texte résumé créé avec succès !'}
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Titre du texte résumé"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orateur *
            </label>
            <input
              type="text"
              required
              value={formData.speaker}
              onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Nom de l'orateur"
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
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            placeholder="Description du texte résumé..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="Enseignement">Enseignement</option>
              <option value="Foi">Foi</option>
              <option value="Prière">Prière</option>
              <option value="Amour">Amour</option>
              <option value="Espérance">Espérance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mois
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={formData.mois}
              onChange={(e) => setFormData({ ...formData, mois: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année
            </label>
            <input
              type="number"
              min="2000"
              max="2100"
              value={formData.annee}
              onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) || new Date().getFullYear() })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de culte
          </label>
          <select
            value={formData.typeCulte}
            onChange={(e) => setFormData({ ...formData, typeCulte: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="Culte de Louange">Culte de Louange</option>
            <option value="Culte d'Impact">Culte d'Impact</option>
            <option value="Culte Prophétique">Culte Prophétique</option>
            <option value="Culte d'Enseignement">Culte d'Enseignement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            placeholder="foi, prière, amour"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichier PDF {!initialData && '*'}
          </label>
          <input
            type="file"
            accept=".pdf"
            required={!initialData}
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {pdfFile && (
            <p className="mt-2 text-sm text-gray-600">
              Fichier sélectionné: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {initialData?.pdfUrl && !pdfFile && (
            <p className="mt-2 text-sm text-gray-600">
              PDF actuel: <a href={initialData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir le PDF</a>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de couverture (optionnel)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {imageFile && (
            <p className="mt-2 text-sm text-gray-600">
              Image sélectionnée: {imageFile.name}
            </p>
          )}
          {initialData?.coverImageUrl && !imageFile && (
            <div className="mt-2">
              <img
                src={initialData.coverImageUrl}
                alt="Couverture actuelle"
                className="h-32 w-auto rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
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
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : initialData ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}

