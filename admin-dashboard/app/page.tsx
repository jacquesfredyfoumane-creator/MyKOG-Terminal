import Link from 'next/link';
import {
  BookOpenIcon,
  MegaphoneIcon,
  VideoCameraIcon,
  ArrowRightIcon,
  FolderIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const quickAccess = [
    {
      title: 'Enseignements',
      icon: BookOpenIcon,
      color: 'bg-blue-500',
      size: '2.3 GB',
      items: '23 éléments',
      href: '/enseignements',
    },
    {
      title: 'Annonces',
      icon: MegaphoneIcon,
      color: 'bg-green-500',
      size: '1.2 MB',
      items: '12 éléments',
      href: '/annonces',
    },
    {
      title: 'Lives',
      icon: VideoCameraIcon,
      color: 'bg-purple-500',
      size: '241 MB',
      items: '8 éléments',
      href: '/lives',
    },
    {
      title: 'Statistiques',
      icon: DocumentIcon,
      color: 'bg-orange-500',
      size: '12.3 MB',
      items: 'Rapport',
      href: '/statistiques',
    },
  ];

  const recentActions = [
    { type: 'Enseignement', name: 'La Puissance de la Foi', time: 'Il y a 2 heures', icon: BookOpenIcon },
    { type: 'Annonce', name: 'Réunion de prière', time: 'Hier', icon: MegaphoneIcon },
    { type: 'Live', name: 'Culte du dimanche', time: 'Il y a 3 jours', icon: VideoCameraIcon },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">
          Gérez et publiez du contenu vers votre base de données Firebase
        </p>
      </div>

      {/* Quick Access Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Accès rapide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccess.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center shadow-sm`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{item.size}</span>
                <span>•</span>
                <span>{item.items}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Actions récentes</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{action.name}</p>
                  <p className="text-sm text-gray-500">{action.type}</p>
                </div>
                <span className="text-sm text-gray-400">{action.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">URL de l'API</p>
              <p className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Statut du serveur</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-900">Connecté</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
