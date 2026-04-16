'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteTrack,
  Track,
  ConnectionState,
} from 'livekit-client';
import {
  ArrowPathIcon,
  SignalIcon,
  SignalSlashIcon,
  UserGroupIcon,
  VideoCameraSlashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';

interface LiveKitPreviewProps {
  serverUrl: string;
  token: string;
  roomName: string;
}

type ConnState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export default function LiveKitPreview({ serverUrl, token, roomName }: LiveKitPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roomRef = useRef<Room | null>(null);

  const [connState, setConnState] = useState<ConnState>('disconnected');
  const [participantCount, setParticipantCount] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publisherName, setPublisherName] = useState<string | null>(null);

  const attachTrack = useCallback((track: RemoteTrack) => {
    if (track.kind === Track.Kind.Video && videoRef.current) {
      track.attach(videoRef.current);
      setHasVideo(true);
    }
    if (track.kind === Track.Kind.Audio && audioRef.current) {
      track.attach(audioRef.current);
      setHasAudio(true);
    }
  }, []);

  const detachTrack = useCallback((track: RemoteTrack) => {
    track.detach();
    if (track.kind === Track.Kind.Video) setHasVideo(false);
    if (track.kind === Track.Kind.Audio) setHasAudio(false);
  }, []);

  const connect = useCallback(async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
    }

    setConnState('connecting');
    setError(null);
    setHasVideo(false);
    setHasAudio(false);

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });
    roomRef.current = room;

    room.on(RoomEvent.Connected, () => {
      setConnState('connected');
      setParticipantCount(room.remoteParticipants.size);
    });

    room.on(RoomEvent.Disconnected, () => {
      setConnState('disconnected');
      setParticipantCount(0);
      setHasVideo(false);
      setHasAudio(false);
      setPublisherName(null);
    });

    room.on(RoomEvent.Reconnecting, () => setConnState('reconnecting'));
    room.on(RoomEvent.Reconnected, () => setConnState('connected'));

    room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      setParticipantCount(room.remoteParticipants.size);
      setPublisherName(participant.name || participant.identity);
    });

    room.on(RoomEvent.ParticipantDisconnected, () => {
      setParticipantCount(room.remoteParticipants.size);
    });

    room.on(
      RoomEvent.TrackSubscribed,
      (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
        attachTrack(track);
        setPublisherName(participant.name || participant.identity);
      }
    );

    room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
      detachTrack(track);
    });

    room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
      if (state === ConnectionState.Reconnecting) setConnState('reconnecting');
    });

    try {
      await room.connect(serverUrl, token);

      // Attacher les tracks déjà présents
      room.remoteParticipants.forEach((participant) => {
        setPublisherName(participant.name || participant.identity);
        participant.trackPublications.forEach((pub) => {
          if (pub.track && pub.isSubscribed) {
            attachTrack(pub.track as RemoteTrack);
          }
        });
      });
    } catch (e: any) {
      setConnState('error');
      setError(e.message || 'Impossible de se connecter à LiveKit');
    }
  }, [serverUrl, token, attachTrack, detachTrack]);

  const disconnect = useCallback(async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
    setConnState('disconnected');
    setHasVideo(false);
    setHasAudio(false);
    setPublisherName(null);
  }, []);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
    };
  }, []);

  const stateConfig: Record<ConnState, { label: string; color: string; dot: string }> = {
    disconnected: { label: 'Déconnecté', color: 'text-gray-500', dot: 'bg-gray-400' },
    connecting:   { label: 'Connexion…', color: 'text-blue-600', dot: 'bg-blue-400 animate-pulse' },
    connected:    { label: 'Connecté',   color: 'text-green-600', dot: 'bg-green-500' },
    reconnecting: { label: 'Reconnexion…', color: 'text-amber-600', dot: 'bg-amber-400 animate-pulse' },
    error:        { label: 'Erreur',     color: 'text-red-600', dot: 'bg-red-500' },
  };

  const s = stateConfig[connState];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
          <div>
            <span className="font-semibold text-gray-900">Prévisualisation du flux OBS</span>
            <span className={`ml-2 text-sm ${s.color}`}>{s.label}</span>
          </div>
          {publisherName && connState === 'connected' && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              🎙️ {publisherName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Participants */}
          {connState === 'connected' && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <UserGroupIcon className="h-4 w-4" />
              <span>{participantCount}</span>
            </div>
          )}

          {/* Mute audio */}
          {hasAudio && connState === 'connected' && (
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.muted = !muted;
                setMuted(!muted);
              }}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              title={muted ? 'Activer le son' : 'Couper le son'}
            >
              {muted
                ? <SpeakerXMarkIcon className="h-4 w-4 text-red-500" />
                : <SpeakerWaveIcon className="h-4 w-4" />
              }
            </button>
          )}

          {/* Connect / Disconnect */}
          {connState === 'disconnected' || connState === 'error' ? (
            <button
              onClick={connect}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
            >
              <SignalIcon className="h-4 w-4" />
              Se connecter
            </button>
          ) : connState === 'connecting' || connState === 'reconnecting' ? (
            <button disabled className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-500 text-sm rounded-lg cursor-not-allowed">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Connexion…
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-100 transition-colors"
            >
              <SignalSlashIcon className="h-4 w-4" />
              Déconnecter
            </button>
          )}
        </div>
      </div>

      {/* Zone vidéo */}
      <div className="relative bg-gray-950" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-contain transition-opacity duration-300 ${hasVideo ? 'opacity-100' : 'opacity-0'}`}
        />
        <audio ref={audioRef} autoPlay />

        {/* Overlay quand pas de vidéo */}
        {!hasVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
            {connState === 'disconnected' || connState === 'error' ? (
              <>
                <VideoCameraSlashIcon className="h-12 w-12 text-gray-600" />
                <p className="text-sm text-gray-400">
                  {connState === 'error' ? 'Erreur de connexion' : 'Cliquez sur "Se connecter" pour voir le flux'}
                </p>
              </>
            ) : connState === 'connected' ? (
              <>
                <div className="relative">
                  <SignalIcon className="h-12 w-12 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full animate-pulse" />
                </div>
                <p className="text-sm text-gray-400">En attente du flux OBS…</p>
                <p className="text-xs text-gray-500">Démarrez le stream dans OBS avec la config WHIP/RTMP ci-dessous</p>
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-12 w-12 text-gray-600 animate-spin" />
                <p className="text-sm text-gray-400">Connexion en cours…</p>
              </>
            )}
          </div>
        )}

        {/* Badge LIVE */}
        {hasVideo && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}

        {/* Badge room */}
        {connState === 'connected' && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded font-mono">
            📡 {roomName}
          </div>
        )}

        {/* Badge audio */}
        {hasAudio && connState === 'connected' && (
          <div className={`absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${muted ? 'bg-red-900/70 text-red-300' : 'bg-black/60 text-green-400'}`}>
            {muted ? <SpeakerXMarkIcon className="h-3.5 w-3.5" /> : <SpeakerWaveIcon className="h-3.5 w-3.5" />}
            {muted ? 'Muet' : 'Audio actif'}
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="px-5 py-3 bg-red-50 border-t border-red-100 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Info connexion */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>🔗 <span className="font-mono">{serverUrl}</span></span>
          <span>·</span>
          <span>Room: <span className="font-mono font-medium text-gray-700">{roomName}</span></span>
        </div>
        {connState === 'connected' && (
          <div className="flex gap-3 text-xs">
            <span className={hasVideo ? 'text-green-600' : 'text-gray-400'}>
              {hasVideo ? '🎥 Vidéo' : '🚫 Pas de vidéo'}
            </span>
            <span className={hasAudio ? 'text-green-600' : 'text-gray-400'}>
              {hasAudio ? '🔊 Audio' : '🔇 Pas d\'audio'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
