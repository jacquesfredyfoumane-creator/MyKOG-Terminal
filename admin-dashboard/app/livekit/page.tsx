'use client';

import LiveKitPanel from '@/components/LiveKitPanel';
import ConnectionStatus from '@/components/ConnectionStatus';

export default function LiveKitPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🎥</span>
          <h1 className="text-3xl font-bold text-gray-900">LiveKit Streaming</h1>
        </div>
        <p className="text-gray-600 mt-1">
          Gérer les rooms LiveKit, configurer OBS et générer des tokens pour le streaming
        </p>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <span className="hover:text-gray-900 cursor-pointer">Accueil</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">LiveKit</span>
      </div>

      <ConnectionStatus />

      <div className="mt-6">
        <LiveKitPanel />
      </div>
    </div>
  );
}
