'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BookOpenIcon,
  MegaphoneIcon,
  VideoCameraIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  BellIcon,
  Cog6ToothIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  MegaphoneIcon as MegaphoneIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CalendarIcon as CalendarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BellIcon as BellIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
} from '@heroicons/react/24/solid';

const navigation = [
  { name: 'Accueil', href: '/', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Enseignements', href: '/enseignements', icon: BookOpenIcon, iconSolid: BookOpenIconSolid },
  { name: 'Textes Résumés', href: '/text-resumes', icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
  { name: 'Annonces', href: '/annonces', icon: MegaphoneIcon, iconSolid: MegaphoneIconSolid },
  { name: 'Lives', href: '/lives', icon: VideoCameraIcon, iconSolid: VideoCameraIconSolid },
  { name: 'Calendrier', href: '/calendar', icon: CalendarIcon, iconSolid: CalendarIconSolid },
  { name: 'Utilisateurs', href: '/users', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
  { name: 'Notifications', href: '/notifications', icon: BellIcon, iconSolid: BellIconSolid },
  { name: 'Statistiques', href: '/statistiques', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">MyKOG Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Dashboard de publication</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = isActive ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <IconComponent className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm">Paramètres</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <TrashIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm">Corbeille</span>
        </button>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-600">Stockage</span>
            <span className="text-xs text-gray-500">42%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '42%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">42 GB utilisés sur 100 GB</p>
        </div>
      </div>
    </div>
  );
}
