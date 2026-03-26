'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      const connected = await apiClient.healthCheck();
      setIsConnected(connected);
      setIsChecking(false);
    };

    checkConnection();
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Serveur backend non accessible
            </p>
            <p className="text-xs text-red-600 mt-1">
              Assurez-vous que le backend API est démarré sur http://localhost:3000
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="h-4 w-4 text-green-600" />
        <p className="text-xs text-green-800">
          Connecté au serveur backend
        </p>
      </div>
    </div>
  );
}

