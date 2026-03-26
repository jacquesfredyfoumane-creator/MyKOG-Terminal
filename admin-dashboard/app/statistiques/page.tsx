'use client';

import { useState, useEffect } from 'react';
import { enseignementsApi } from '@/lib/api/enseignements';
import { annoncesApi } from '@/lib/api/annonces';
import { livesApi } from '@/lib/api/lives';
import { Enseignement, Annonce, LiveStream } from '@/types';
import ConnectionStatus from '@/components/ConnectionStatus';
import {
  BookOpenIcon,
  MegaphoneIcon,
  VideoCameraIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function StatistiquesPage() {
  const [enseignements, setEnseignements] = useState<Enseignement[]>([]);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [lives, setLives] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [enseignementsData, annoncesData, livesData] = await Promise.all([
          enseignementsApi.getAll(),
          annoncesApi.getAll(),
          livesApi.getAll(),
        ]);
        setEnseignements(enseignementsData);
        setAnnonces(annoncesData);
        setLives(livesData);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    {
      name: 'Enseignements',
      value: enseignements.length,
      icon: BookOpenIcon,
      color: 'bg-blue-500',
      description: `${enseignements.filter(e => e.isNew).length} nouveaux`,
    },
    {
      name: 'Annonces',
      value: annonces.length,
      icon: MegaphoneIcon,
      color: 'bg-green-500',
      description: 'Total publiées',
    },
    {
      name: 'Lives',
      value: lives.length,
      icon: VideoCameraIcon,
      color: 'bg-purple-500',
      description: `${lives.filter(l => l.status === 'live').length} en direct`,
    },
    {
      name: 'Total',
      value: enseignements.length + annonces.length + lives.length,
      icon: ChartBarIcon,
      color: 'bg-gray-500',
      description: 'Contenus publiés',
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques</h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre contenu publié
        </p>
      </div>

      <div className="mb-6 text-sm text-gray-600">
        <span className="hover:text-gray-900 cursor-pointer">Accueil</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Statistiques</span>
      </div>

      <ConnectionStatus />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center shadow-sm`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Répartition des enseignements
          </h2>
          <div className="space-y-4">
            {Array.from(new Set(enseignements.map(e => e.category))).map((category) => {
              const count = enseignements.filter(e => e.category === category).length;
              const percentage = enseignements.length > 0 ? (count / enseignements.length) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">{category}</span>
                    <span className="text-gray-500">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {enseignements.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucun enseignement</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Statut des lives
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">En direct</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {lives.filter(l => l.status === 'live').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Programmés</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {lives.filter(l => l.status === 'scheduled').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Terminés</span>
              </div>
              <span className="text-lg font-bold text-gray-600">
                {lives.filter(l => l.status === 'ended').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
