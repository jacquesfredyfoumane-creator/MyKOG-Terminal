const { db } = require('../config/firebase');
const { 
  STREAM_CONFIG, 
  getServerIP,
  getHLSUrl, 
  getRTMPUrl, 
  getHLSUrlWithIP,
  getRTMPUrlWithIP,
  isValidStreamKey,
  generateStreamKey 
} = require('../utils/stream_helper');
const FFmpegTranscoder = require('../utils/ffmpeg_transcoder');
const LiveKitService = require('../services/livekitService');

// Gestionnaire global des transcoders actifs
const activeTranscoders = new Map();

// Instance LiveKit Service (initialisée paresseusement)
let liveKitService = null;

const getLiveKitService = () => {
  if (!liveKitService) {
    liveKitService = new LiveKitService();
  }
  return liveKitService;
};

// Créer un live stream
const createLiveStream = async (req, res) => {
  try {
    const { title, description, pastor, thumbnailUrl, streamUrl, streamKey, scheduledAt, serverIP } = req.body;

    // Vérifier les champs requis
    if (!title || !pastor) {
      return res.status(400).json({
        error: 'Title et pastor sont requis'
      });
    }

    const now = new Date();

    // Générer ou utiliser la clé de stream
    let finalStreamKey = streamKey || STREAM_CONFIG.DEFAULT_STREAM_KEY;
    
    // Si une clé personnalisée est fournie, la valider
    if (streamKey && !isValidStreamKey(streamKey)) {
      return res.status(400).json({
        error: 'Clé de stream invalide. Utilisez uniquement des caractères alphanumériques, tirets et underscores.'
      });
    }

    // Générer les URLs RTMP et HLS
    const rtmpUrl = serverIP 
      ? getRTMPUrlWithIP(serverIP, finalStreamKey)
      : getRTMPUrl(finalStreamKey);
    
    const hlsUrl = serverIP 
      ? getHLSUrlWithIP(serverIP, finalStreamKey)
      : getHLSUrl(finalStreamKey);

    // Utiliser l'URL HLS fournie ou générer automatiquement
    const finalStreamUrl = (streamUrl && streamUrl.trim() !== '') ? streamUrl : hlsUrl;

    // Créer l'objet live stream
    const liveStreamData = {
      title: title,
      description: description || '',
      pastor: pastor,
      thumbnailUrl: thumbnailUrl || '',
      streamUrl: finalStreamUrl, // URL HLS pour la lecture
      streamKey: finalStreamKey, // Clé de streaming pour OBS
      rtmpUrl: rtmpUrl, // URL RTMP pour OBS (ajouté)
      hlsUrl: hlsUrl, // URL HLS générée (ajouté)
      status: req.body.status || 'scheduled', // scheduled, live, ended
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      startedAt: null,
      endedAt: null,
      viewerCount: 0,
      peakViewerCount: 0,
      tags: req.body.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    // Sauvegarder dans Firestore
    const docRef = await db.collection('liveStreams').add(liveStreamData);

    // Démarrer le transcodage automatique si le statut est "live"
    if (liveStreamData.status === 'live') {
      try {
        const transcoder = new FFmpegTranscoder(finalStreamKey);
        transcoder.start();
        activeTranscoders.set(finalStreamKey, transcoder);
        console.log(`✅ Transcoder démarré automatiquement pour: ${finalStreamKey}`);
      } catch (error) {
        console.error(`⚠️ Erreur démarrage transcoder: ${error.message}`);
        // Ne pas faire échouer la création du live si le transcoder ne démarre pas
      }
    }

    res.status(201).json({
      id: docRef.id,
      message: 'Live stream créé avec succès',
      data: liveStreamData
    });

  } catch (error) {
    console.error('Erreur lors de la création du live:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du live stream',
      details: error.message
    });
  }
};

// Récupérer tous les live streams
const getAllLiveStreams = async (req, res) => {
  try {
    const liveStreamsSnapshot = await db.collection('liveStreams').get();
    const liveStreams = [];

    const { getServerIP, getHLSUrl, getRTMPUrl } = require('../utils/stream_helper');
    const currentIP = getServerIP();
    
    liveStreamsSnapshot.forEach(doc => {
      const data = doc.data();
      const streamKey = data.streamKey || 'mykog_live';
      
      // Utiliser l'IP actuelle pour les URLs
      const currentHlsUrl = getHLSUrl(streamKey);
      const currentRtmpUrl = getRTMPUrl(streamKey);
      
      liveStreams.push({
        id: doc.id,
        title: data.title || 'Live Stream',
        description: data.description || '',
        pastor: data.pastor || 'Unknown',
        thumbnailUrl: data.thumbnailUrl || '',
        streamUrl: currentHlsUrl, // Toujours utiliser l'IP actuelle
        streamKey: streamKey,
        rtmpUrl: currentRtmpUrl, // Toujours utiliser l'IP actuelle
        hlsUrl: currentHlsUrl, // Toujours utiliser l'IP actuelle
        status: data.status || 'scheduled',
        scheduledAt: data.scheduledAt?.toDate() || null,
        startedAt: data.startedAt?.toDate() || null,
        endedAt: data.endedAt?.toDate() || null,
        viewerCount: data.viewerCount || 0,
        peakViewerCount: data.peakViewerCount || 0,
        tags: data.tags || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    // Trier: live en premier, puis scheduled, puis ended
    liveStreams.sort((a, b) => {
      const statusOrder = { live: 0, scheduled: 1, ended: 2 };
      return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
    });

    res.json(liveStreams);
  } catch (error) {
    console.error('Erreur lors de la récupération des lives:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des live streams'
    });
  }
};

// Récupérer un live stream par ID
const getLiveStreamById = async (req, res) => {
  try {
    const { id } = req.params;
    const liveStreamDoc = await db.collection('liveStreams').doc(id).get();

    if (!liveStreamDoc.exists) {
      return res.status(404).json({
        error: 'Live stream non trouvé'
      });
    }

    const data = liveStreamDoc.data();
    res.json({
      id: liveStreamDoc.id,
      ...data,
      scheduledAt: data.scheduledAt?.toDate(),
      startedAt: data.startedAt?.toDate(),
      endedAt: data.endedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du live:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du live stream'
    });
  }
};

// Mettre à jour un live stream (complet)
const updateLiveStream = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, pastor, thumbnailUrl, streamUrl, streamKey, status, serverIP } = req.body;

    const liveStreamRef = db.collection('liveStreams').doc(id);
    const liveStreamDoc = await liveStreamRef.get();

    if (!liveStreamDoc.exists) {
      return res.status(404).json({
        error: 'Live stream non trouvé'
      });
    }

    const now = new Date();
    const updateData = {
      updatedAt: now,
    };

    // Mettre à jour les champs fournis
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (pastor !== undefined) updateData.pastor = pastor;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    
    // Gérer la clé de stream et les URLs
    const currentData = liveStreamDoc.data();
    let finalStreamKey = streamKey || currentData.streamKey || STREAM_CONFIG.DEFAULT_STREAM_KEY;
    
    // Valider la clé si fournie
    if (streamKey && !isValidStreamKey(streamKey)) {
      return res.status(400).json({
        error: 'Clé de stream invalide. Utilisez uniquement des caractères alphanumériques, tirets et underscores.'
      });
    }
    
    // Générer les URLs si la clé change ou si l'IP change
    if (streamKey || serverIP) {
      const rtmpUrl = serverIP 
        ? getRTMPUrlWithIP(serverIP, finalStreamKey)
        : getRTMPUrl(finalStreamKey);
      
      const hlsUrl = serverIP 
        ? getHLSUrlWithIP(serverIP, finalStreamKey)
        : getHLSUrl(finalStreamKey);
      
      updateData.streamKey = finalStreamKey;
      updateData.rtmpUrl = rtmpUrl;
      updateData.hlsUrl = hlsUrl;
      
      // Mettre à jour l'URL de stream si non fournie explicitement
      if (!streamUrl) {
        updateData.streamUrl = hlsUrl;
      }
    }
    
    if (streamUrl !== undefined) updateData.streamUrl = streamUrl;
    
    // Gérer le statut
    if (status !== undefined) {
      if (!['scheduled', 'live', 'ended'].includes(status)) {
        return res.status(400).json({
          error: 'Status invalide. Doit être: scheduled, live, ou ended'
        });
      }
      updateData.status = status;
      
      // Ajouter timestamps selon le statut
      const currentData = liveStreamDoc.data();
      const previousStatus = currentData.status;
      const streamKey = currentData.streamKey || finalStreamKey || STREAM_CONFIG.DEFAULT_STREAM_KEY;
      
      if (status === 'live' && !currentData.startedAt) {
        updateData.startedAt = now;
        // Démarrer le transcodage si on passe à "live"
        if (previousStatus !== 'live') {
          try {
            const transcoder = new FFmpegTranscoder(streamKey);
            transcoder.start();
            activeTranscoders.set(streamKey, transcoder);
            console.log(`✅ Transcoder démarré pour: ${streamKey}`);
          } catch (error) {
            console.error(`⚠️ Erreur démarrage transcoder: ${error.message}`);
          }
        }
      } else if (status === 'ended') {
        updateData.endedAt = now;
        // Arrêter le transcodage si on passe à "ended"
        if (previousStatus === 'live') {
          const transcoder = activeTranscoders.get(streamKey);
          if (transcoder) {
            transcoder.stop();
            activeTranscoders.delete(streamKey);
            console.log(`🛑 Transcoder arrêté pour: ${streamKey}`);
          }
        }
      }
    }

    await liveStreamRef.update(updateData);

    // Récupérer le document mis à jour
    const updatedDoc = await liveStreamRef.get();
    const updatedData = updatedDoc.data();

    res.json({
      id: id,
      message: 'Live stream mis à jour avec succès',
      data: {
        id: updatedDoc.id,
        ...updatedData,
        scheduledAt: updatedData.scheduledAt?.toDate(),
        startedAt: updatedData.startedAt?.toDate(),
        endedAt: updatedData.endedAt?.toDate(),
        createdAt: updatedData.createdAt?.toDate(),
        updatedAt: updatedData.updatedAt?.toDate(),
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du live:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du live stream',
      details: error.message
    });
  }
};

// Mettre à jour le statut d'un live stream
const updateLiveStreamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'live', 'ended'].includes(status)) {
      return res.status(400).json({
        error: 'Status invalide. Doit être: scheduled, live, ou ended'
      });
    }

    const liveStreamRef = db.collection('liveStreams').doc(id);
    const liveStreamDoc = await liveStreamRef.get();

    if (!liveStreamDoc.exists) {
      return res.status(404).json({
        error: 'Live stream non trouvé'
      });
    }

    const now = new Date();
    const updateData = {
      status: status,
      updatedAt: now,
    };

    const currentData = liveStreamDoc.data();
    const previousStatus = currentData.status;
    const streamKey = currentData.streamKey || STREAM_CONFIG.DEFAULT_STREAM_KEY;

    // Ajouter timestamps selon le statut
    if (status === 'live' && !currentData.startedAt) {
      updateData.startedAt = now;
      // Démarrer le transcodage si on passe à "live"
      if (previousStatus !== 'live') {
        try {
          const transcoder = new FFmpegTranscoder(streamKey);
          transcoder.start();
          activeTranscoders.set(streamKey, transcoder);
          console.log(`✅ Transcoder démarré pour: ${streamKey}`);
        } catch (error) {
          console.error(`⚠️ Erreur démarrage transcoder: ${error.message}`);
        }
      }
    } else if (status === 'ended') {
      updateData.endedAt = now;
      // Arrêter le transcodage si on passe à "ended"
      if (previousStatus === 'live') {
        const transcoder = activeTranscoders.get(streamKey);
        if (transcoder) {
          transcoder.stop();
          activeTranscoders.delete(streamKey);
          console.log(`🛑 Transcoder arrêté pour: ${streamKey}`);
        }
      }
    }

    await liveStreamRef.update(updateData);

    res.json({
      id: id,
      message: `Statut mis à jour: ${status}`,
      data: updateData
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du statut'
    });
  }
};

// Incrémenter le nombre de viewers (appelé quand un utilisateur rejoint)
const incrementViewerCount = async (req, res) => {
  try {
    const { id } = req.params;

    const liveStreamRef = db.collection('liveStreams').doc(id);
    const liveStreamDoc = await liveStreamRef.get();

    if (!liveStreamDoc.exists) {
      return res.status(404).json({
        error: 'Live stream non trouvé'
      });
    }

    const currentData = liveStreamDoc.data();
    const newViewerCount = (currentData.viewerCount || 0) + 1;
    const peakViewerCount = Math.max(newViewerCount, currentData.peakViewerCount || 0);

    await liveStreamRef.update({
      viewerCount: newViewerCount,
      peakViewerCount: peakViewerCount,
      updatedAt: new Date(),
    });

    res.json({
      id: id,
      viewerCount: newViewerCount,
      peakViewerCount: peakViewerCount,
      message: 'Viewer count incrémenté'
    });

  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des viewers:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'incrémentation du compteur'
    });
  }
};

// Décrémenter le nombre de viewers (appelé quand un utilisateur quitte)
const decrementViewerCount = async (req, res) => {
  try {
    const { id } = req.params;

    const liveStreamRef = db.collection('liveStreams').doc(id);
    const liveStreamDoc = await liveStreamRef.get();

    if (!liveStreamDoc.exists) {
      return res.status(404).json({
        error: 'Live stream non trouvé'
      });
    }

    const currentData = liveStreamDoc.data();
    const newViewerCount = Math.max((currentData.viewerCount || 0) - 1, 0);

    await liveStreamRef.update({
      viewerCount: newViewerCount,
      updatedAt: new Date(),
    });

    res.json({
      id: id,
      viewerCount: newViewerCount,
      message: 'Viewer count décrémenté'
    });

  } catch (error) {
    console.error('Erreur lors de la décrémentation des viewers:', error);
    res.status(500).json({
      error: 'Erreur lors de la décrémentation du compteur'
    });
  }
};

// Obtenir le nombre de viewers en temps réel
const getViewerCount = async (req, res) => {
  try {
    const { id } = req.params;

    const liveStreamDoc = await db.collection('liveStreams').doc(id).get();

    if (!liveStreamDoc.exists) {
      return res.status(404).json({
        error: 'Live stream non trouvé'
      });
    }

    const data = liveStreamDoc.data();
    res.json({
      id: id,
      viewerCount: data.viewerCount || 0,
      peakViewerCount: data.peakViewerCount || 0,
      status: data.status || 'scheduled',
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du compteur:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du compteur'
    });
  }
};

// Obtenir le live actif (status = 'live')
const getActiveLive = async (req, res) => {
  try {
    // Récupérer tous les lives et filtrer côté serveur pour éviter l'index Firestore
    const liveStreamsSnapshot = await db.collection('liveStreams').get();
    
    // Filtrer les lives actifs et trier par startedAt
    const activeLives = [];
    liveStreamsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'live') {
        activeLives.push({
          id: doc.id,
          data: data,
          startedAt: data.startedAt?.toDate() || new Date(0)
        });
      }
    });
    
    // Trier par startedAt (le plus récent en premier)
    activeLives.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    
    if (activeLives.length === 0) {
      return res.status(404).json({
        error: 'Aucun live actif',
        data: null
      });
    }

    // Prendre le live le plus récent
    const mostRecent = activeLives[0];
    const data = mostRecent.data;

    // Utiliser l'IP actuelle du serveur pour les URLs
    const currentIP = getServerIP();
    const streamKey = data.streamKey || 'mykog_live';
    
    // Générer les URLs avec l'IP actuelle
    const currentHlsUrl = getHLSUrl(streamKey);
    const currentRtmpUrl = getRTMPUrl(streamKey);
    
    res.json({
      id: mostRecent.id,
      title: data.title || 'Live en cours',
      description: data.description || '',
      pastor: data.pastor || 'MyKOG',
      thumbnailUrl: data.thumbnailUrl || '',
      streamUrl: currentHlsUrl, // Toujours utiliser l'IP actuelle
      streamKey: streamKey,
      rtmpUrl: currentRtmpUrl, // Toujours utiliser l'IP actuelle
      hlsUrl: currentHlsUrl, // Toujours utiliser l'IP actuelle
      status: data.status || 'live',
      viewerCount: data.viewerCount || 0,
      peakViewerCount: data.peakViewerCount || 0,
      scheduledAt: data.scheduledAt?.toDate() || null,
      startedAt: data.startedAt?.toDate() || null,
      endedAt: data.endedAt?.toDate() || null,
      tags: data.tags || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du live actif:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du live actif',
      details: error.message
    });
  }
};

// Obtenir les infos serveur (IP + URLs RTMP/HLS)
const getServerInfo = (req, res) => {
  try {
    const ip = getServerIP();
    const streamKey = STREAM_CONFIG.DEFAULT_STREAM_KEY;

    res.json({
      serverIP: ip,
      rtmpUrl: getRTMPUrlWithIP(ip, streamKey),
      hlsUrl: getHLSUrlWithIP(ip, streamKey),
      streamKey,
      rtmpPort: STREAM_CONFIG.RTMP_PORT,
      hlsPort: STREAM_CONFIG.HLS_PORT,
      hlsPath: STREAM_CONFIG.HLS_PATH,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des infos serveur:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des informations serveur',
      details: error.message,
    });
  }
};

// Supprimer un live stream
const deleteLiveStream = async (req, res) => {
  try {
    const { id } = req.params;

    const liveStreamRef = db.collection('liveStreams').doc(id);
    const liveStreamDoc = await liveStreamRef.get();

    if (!liveStreamDoc.exists) {
      return res.status(404).json({
        error: 'Live stream non trouvé'
      });
    }

    await liveStreamRef.delete();

    res.json({
      id: id,
      message: 'Live stream supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du live stream'
    });
  }
};

// ===== FONCTIONS LIVEKIT =====

// Créer une room LiveKit
const createLiveKitRoom = async (req, res) => {
  try {
    const { roomName, maxParticipants = 1000 } = req.body;

    console.log('createLiveKitRoom - roomName:', roomName, 'maxParticipants:', maxParticipants);

    if (!roomName) {
      return res.status(400).json({
        error: 'roomName est requis'
      });
    }

    console.log('Appel de getLiveKitService()...');
    const service = getLiveKitService();
    console.log('Service obtenu, appel de createRoom...');
    
    const room = await service.createRoom(roomName, {
      maxParticipants
    });
    
    console.log('Room créée:', room);

    res.status(201).json({
      message: 'Room LiveKit créée avec succès',
      room: {
        name: room.name,
        sid: room.sid,
        maxParticipants: room.maxParticipants,
        participantCount: room.participantCount,
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur création room LiveKit:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la room LiveKit',
      details: error.message
    });
  }
};

// Générer un token LiveKit
const getLiveKitToken = async (req, res) => {
  try {
    const { roomName, participantName, isHost = false } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({
        error: 'roomName et participantName sont requis'
      });
    }

    const token = await getLiveKitService().generateParticipantToken(
      roomName,
      participantName,
      isHost
    );

    res.json({
      token,
      roomName,
      participantName,
      isHost,
      liveKitUrl: process.env.LIVEKIT_URL
    });
  } catch (error) {
    console.error('Erreur génération token LiveKit:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération du token LiveKit',
      details: error.message
    });
  }
};

// Lister les rooms LiveKit
const listLiveKitRooms = async (req, res) => {
  try {
    const rooms = await getLiveKitService().listRooms();
    
    res.json({
      rooms: rooms.map(room => ({
        name: room.name,
        sid: room.sid,
        maxParticipants: room.maxParticipants,
        participantCount: room.participantCount,
        createdAt: room.createdAt
      }))
    });
  } catch (error) {
    console.error('Erreur listage rooms LiveKit:', error);
    res.status(500).json({
      error: 'Erreur lors du listage des rooms LiveKit',
      details: error.message
    });
  }
};

// Supprimer une room LiveKit
const deleteLiveKitRoom = async (req, res) => {
  try {
    const { roomName } = req.params;

    await getLiveKitService().deleteRoom(roomName);

    res.json({
      message: `Room ${roomName} supprimée avec succès`
    });
  } catch (error) {
    console.error('Erreur suppression room LiveKit:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de la room LiveKit',
      details: error.message
    });
  }
};

// Démarrer un enregistrement LiveKit
const startLiveKitRecording = async (req, res) => {
  try {
    const { roomName, outputUrl } = req.body;

    if (!roomName) {
      return res.status(400).json({
        error: 'roomName est requis'
      });
    }

    const egress = await getLiveKitService().startRecording(roomName, outputUrl);

    res.status(201).json({
      message: 'Enregistrement démarré avec succès',
      egress: {
        egressId: egress.egressId,
        roomName: egress.roomName,
        status: egress.status,
        startedAt: egress.startedAt
      }
    });
  } catch (error) {
    console.error('Erreur démarrage enregistrement LiveKit:', error);
    res.status(500).json({
      error: 'Erreur lors du démarrage de l\'enregistrement LiveKit',
      details: error.message
    });
  }
};

// Configuration OBS complète pour LiveKit
const getLiveKitObsConfig = async (req, res) => {
  try {
    const { roomName = 'mykog-live', hostName = 'obs-broadcaster' } = req.body;

    // Déterminer l'IP locale
    const { getServerIP } = require('../utils/stream_helper');
    const serverIP = getServerIP();

    // Créer la room si elle n'existe pas encore
    const service = getLiveKitService();
    try {
      await service.createRoom(roomName, { maxParticipants: 500 });
    } catch (e) {
      // Room probablement déjà existante, continuer
    }

    // Générer le token host pour OBS (WHIP)
    const obsToken = await service.generateParticipantToken(roomName, hostName, true);

    // Générer un token viewer pour le frontend Flutter
    const viewerToken = await service.generateParticipantToken(roomName, 'flutter-viewer', false);

    res.json({
      livekit: {
        serverUrl: `ws://${serverIP}:7880`,
        apiKey: process.env.LIVEKIT_API_KEY,
        roomName,
      },
      obs: {
        // Pour OBS 30+ (WHIP)
        whip: {
          url: `http://${serverIP}:7880/rtc`,
          bearerToken: obsToken,
          instructions: 'OBS > Paramètres > Flux > Service: WHIP, coller URL et Bearer Token',
        },
        // Pour OBS classique (RTMP via nginx)
        rtmp: {
          url: `rtmp://${serverIP}:1935/live`,
          streamKey: roomName,
          instructions: 'OBS > Paramètres > Flux > Service: Personnalisé, coller URL et Stream Key',
        },
      },
      flutter: {
        viewerToken,
        serverUrl: `ws://${serverIP}:7880`,
        roomName,
        instructions: 'Utiliser viewerToken + serverUrl dans le widget LiveKit Flutter',
      },
    });
  } catch (error) {
    console.error('Erreur config OBS LiveKit:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération de la config OBS',
      details: error.message,
    });
  }
};

// Arrêter un enregistrement LiveKit
const stopLiveKitRecording = async (req, res) => {
  try {
    const { egressId } = req.params;

    await getLiveKitService().stopRecording(egressId);

    res.json({
      message: `Enregistrement ${egressId} arrêté avec succès`
    });
  } catch (error) {
    console.error('Erreur arrêt enregistrement LiveKit:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'arrêt de l\'enregistrement LiveKit',
      details: error.message
    });
  }
};

module.exports = {
  createLiveStream,
  getAllLiveStreams,
  getLiveStreamById,
  getActiveLive,
  getServerInfo,
  updateLiveStream,
  updateLiveStreamStatus,
  incrementViewerCount,
  decrementViewerCount,
  getViewerCount,
  deleteLiveStream,
  // LiveKit
  createLiveKitRoom,
  getLiveKitToken,
  listLiveKitRooms,
  deleteLiveKitRoom,
  startLiveKitRecording,
  stopLiveKitRecording,
  getLiveKitObsConfig,
};

