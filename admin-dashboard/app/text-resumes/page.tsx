'use client';

import { useState, useEffect } from 'react';
import { textResumesApi } from '@/lib/api/textResumes';
import { TextResume } from '@/types';
import TextResumeForm from '@/components/TextResumeForm';
import TextResumeList from '@/components/TextResumeList';

export default function TextResumesPage() {
  const [textResumes, setTextResumes] = useState<TextResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTextResume, setEditingTextResume] = useState<TextResume | null>(null);

  const loadTextResumes = async () => {
    try {
      setLoading(true);
      const data = await textResumesApi.getAll();
      setTextResumes(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTextResumes();
  }, []);

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTextResume(null);
    loadTextResumes();
  };

  const handleEdit = (textResume: TextResume) => {
    setEditingTextResume(textResume);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Textes Résumés</h1>
          <p className="mt-2 text-gray-600">
            Gérez les textes résumés (PDF) de vos enseignements
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTextResume(null);
            setShowForm(!showForm);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {showForm ? 'Annuler' : '+ Nouveau texte résumé'}
        </button>
      </div>

      {showForm && (
        <TextResumeForm
          onSubmit={handleFormSubmit}
          initialData={editingTextResume || undefined}
        />
      )}

      <TextResumeList
        textResumes={textResumes}
        onRefresh={loadTextResumes}
        onEdit={handleEdit}
      />
    </div>
  );
}

