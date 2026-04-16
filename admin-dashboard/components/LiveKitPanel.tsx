'use client';

import { useState, useEffect, useCallback } from 'react';
import { livekitApi, LiveKitRoom, LiveKitObsConfig } from '@/lib/api/livekit';
import LiveKitPreview from '@/components/LiveKitPreview';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon,
  SignalIcon,
  KeyIcon,
  TvIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
      title="Copier"
    >
      {copied ? (
        <><CheckIcon className="h-3.5 w-3.5 text-green-600" />{label ? 'Copié !' : ''}</>
      ) : (
        <><ClipboardDocumentIcon className="h-3.5 w-3.5" />{label || ''}</>
      )}
    </button>
  );
}

function TokenBlock({ label, value }: { label: string; value: string }) {
  const [show, setShow] = useState(false);
  const short = value.length > 60 ? value.slice(0, 60) + '…' : value;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setShow(!show)}
            className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
          >
            {show ? 'Masquer' : 'Voir'}
          </button>
          <CopyButton text={value} />
        </div>
      </div>
      <code className="text-xs text-gray-800 break-all font-mono">
        {show ? value : short}
      </code>
    </div>
  );
}

function ConfigRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 w-32 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={`text-sm text-gray-900 truncate flex-1 ${mono ? 'font-mono' : ''}`}>{value}</span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

export default function LiveKitPanel() {
  const [rooms, setRooms] = useState<LiveKitRoom[]>([]);
  const [obsConfig, setObsConfig] = useState<LiveKitObsConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [obsLoading, setObsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  // Form states
  const [newRoomName, setNewRoomName] = useState('mykog-live');
  const [obsRoomName, setObsRoomName] = useState('mykog-live');
  const [obsHostName, setObsHostName] = useState('obs-broadcaster');
  const [tokenRoom, setTokenRoom] = useState('mykog-live');
  const [tokenParticipant, setTokenParticipant] = useState('');
  const [tokenIsHost, setTokenIsHost] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  // Preview state
  const [preview, setPreview] = useState<{ serverUrl: string; token: string; roomName: string } | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await livekitApi.getRooms();
      setRooms(data.rooms || []);
      setServerOnline(true);
    } catch (e: any) {
      setServerOnline(false);
      setError(e.message || 'Impossible de contacter le serveur LiveKit');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await livekitApi.createRoom(newRoomName.trim());
      await loadRooms();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteRoom = async (name: string) => {
    if (!confirm(`Supprimer la room "${name}" ?`)) return;
    try {
      await livekitApi.deleteRoom(name);
      await loadRooms();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleGetObsConfig = async () => {
    setObsLoading(true);
    setError(null);
    try {
      const config = await livekitApi.getObsConfig(obsRoomName, obsHostName);
      setObsConfig(config);
      // Alimenter automatiquement la preview avec le token viewer
      setPreview({
        serverUrl: config.flutter.serverUrl,
        token: config.flutter.viewerToken,
        roomName: config.flutter.roomName,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setObsLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    if (!tokenParticipant.trim()) return;
    setTokenLoading(true);
    try {
      const res = await livekitApi.getToken(tokenRoom, tokenParticipant, tokenIsHost);
      setGeneratedToken(res.token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setTokenLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Statut serveur */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${serverOnline === null ? 'bg-gray-300 animate-pulse' : serverOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="font-semibold text-gray-900">Serveur LiveKit</p>
              <p className="text-sm text-gray-500">
                {serverOnline === null ? 'Vérification…' : serverOnline ? 'En ligne — ws://localhost:7880' : 'Hors ligne — démarrer avec npm run livekit:start'}
              </p>
            </div>
          </div>
          <button
            onClick={loadRooms}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {!serverOnline && serverOnline !== null && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">LiveKit n'est pas démarré</p>
              <code className="text-xs bg-amber-100 px-2 py-0.5 rounded mt-1 inline-block">
                cd backend-API && npm run livekit:start
              </code>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Rooms actives */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SignalIcon className="h-5 w-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">Rooms actives</h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
              {rooms.length}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Créer room */}
          <div className="flex gap-2">
            <input
              value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
              placeholder="Nom de la room"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
            <button
              onClick={handleCreateRoom}
              disabled={!newRoomName.trim()}
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-40 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Créer
            </button>
          </div>

          {/* Liste des rooms */}
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucune room active</p>
          ) : (
            <div className="space-y-2">
              {rooms.map(room => (
                <div key={room.sid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <span className="font-medium text-sm text-gray-900 font-mono">{room.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {room.numParticipants ?? 0} participant(s) · max {room.maxParticipants}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">{room.sid?.slice(0, 12)}…</span>
                    <button
                      onClick={() => handleDeleteRoom(room.name)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Configuration OBS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Configuration OBS</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            <input
              value={obsRoomName}
              onChange={e => setObsRoomName(e.target.value)}
              placeholder="Room (ex: mykog-live)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <input
              value={obsHostName}
              onChange={e => setObsHostName(e.target.value)}
              placeholder="Nom hôte OBS"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGetObsConfig}
              disabled={obsLoading}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
            >
              {obsLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <TvIcon className="h-4 w-4" />}
              Générer config
            </button>
          </div>

          {obsConfig && (
            <div className="space-y-4">
              {/* WHIP — OBS 30+ */}
              <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">WHIP</span>
                  <span className="text-sm font-semibold text-blue-900">OBS 30+ (recommandé)</span>
                </div>
                <div className="bg-white rounded-lg border border-blue-100 divide-y divide-blue-50">
                  <ConfigRow label="Service" value="WHIP" mono={false} />
                  <ConfigRow label="URL" value={obsConfig.obs.whip.url} />
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500 w-32 shrink-0">Bearer Token</span>
                      <CopyButton text={obsConfig.obs.whip.bearerToken} label="Copier token" />
                    </div>
                    <code className="text-xs font-mono text-gray-700 bg-gray-50 block p-2 rounded truncate">
                      {obsConfig.obs.whip.bearerToken.slice(0, 80)}…
                    </code>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  📍 OBS → Paramètres → Flux → Service: <strong>WHIP</strong>, coller l'URL et le Bearer Token
                </p>
              </div>

              {/* RTMP — OBS classique */}
              <div className="border border-orange-100 bg-orange-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded">RTMP</span>
                  <span className="text-sm font-semibold text-orange-900">OBS classique (&lt; 30)</span>
                </div>
                <div className="bg-white rounded-lg border border-orange-100 divide-y divide-orange-50">
                  <ConfigRow label="Service" value="Personnalisé" mono={false} />
                  <ConfigRow label="URL" value={obsConfig.obs.rtmp.url} />
                  <ConfigRow label="Clé de stream" value={obsConfig.obs.rtmp.streamKey} />
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  📍 OBS → Paramètres → Flux → Service: <strong>Personnalisé</strong>, coller l'URL et la clé
                </p>
              </div>

              {/* Flutter viewer token */}
              <div className="border border-green-100 bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DevicePhoneMobileIcon className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-semibold text-green-900">Token Flutter (Viewer)</span>
                </div>
                <TokenBlock label="viewerToken" value={obsConfig.flutter.viewerToken} />
                <div className="mt-2 bg-white rounded-lg border border-green-100 divide-y divide-green-50">
                  <ConfigRow label="serverUrl" value={obsConfig.flutter.serverUrl} />
                  <ConfigRow label="roomName" value={obsConfig.flutter.roomName} />
                </div>
                <p className="text-xs text-green-700 mt-2">
                  📱 Utiliser ces valeurs dans le widget LiveKit du frontend Flutter
                </p>
              </div>

              {/* Server info */}
              <div className="border border-gray-100 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <SignalIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Informations serveur LiveKit</span>
                </div>
                <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
                  <ConfigRow label="Server URL" value={obsConfig.livekit.serverUrl} />
                  <ConfigRow label="API Key" value={obsConfig.livekit.apiKey} />
                  <ConfigRow label="Room" value={obsConfig.livekit.roomName} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== PREVIEW FLUX OBS ===== */}
      {preview && (
        <LiveKitPreview
          serverUrl={preview.serverUrl}
          token={preview.token}
          roomName={preview.roomName}
        />
      )}

      {/* Générer token personnalisé */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <KeyIcon className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold text-gray-900">Générer un token participant</h2>
        </div>

        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Room</label>
              <input
                value={tokenRoom}
                onChange={e => setTokenRoom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                placeholder="mykog-live"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom du participant</label>
              <input
                value={tokenParticipant}
                onChange={e => setTokenParticipant(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="ex: user-123"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setTokenIsHost(!tokenIsHost)}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${tokenIsHost ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${tokenIsHost ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-gray-700">
                {tokenIsHost ? '🎙️ Hôte (peut publier)' : '👁️ Viewer (lecture seule)'}
              </span>
            </label>

            <button
              onClick={handleGenerateToken}
              disabled={!tokenParticipant.trim() || tokenLoading}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors"
            >
              {tokenLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <KeyIcon className="h-4 w-4" />}
              Générer
            </button>
          </div>

          {generatedToken && (
            <TokenBlock label="Token JWT généré" value={generatedToken} />
          )}
        </div>
      </div>

    </div>
  );
}
