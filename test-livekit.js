require('dotenv').config();
const { RoomServiceClient } = require('livekit-server-sdk');

async function testLiveKitConnection() {
  try {
    console.log('Test de connexion LiveKit...');
    console.log('URL:', process.env.LIVEKIT_URL);
    console.log('API Key:', process.env.LIVEKIT_API_KEY ? 'Définie' : 'Manquante');
    console.log('API Secret:', process.env.LIVEKIT_API_SECRET ? 'Définie' : 'Manquant');

    const client = new RoomServiceClient(
      process.env.LIVEKIT_URL,
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );

    console.log('Client créé, test de listRooms...');
    const rooms = await client.listRooms();
    console.log('Rooms listées avec succès:', rooms.length);
    
  } catch (error) {
    console.error('Erreur de connexion LiveKit:', error.message);
    if (error.code) console.error('Code erreur:', error.code);
    if (error.cause) console.error('Cause:', error.cause);
  }
}

testLiveKitConnection();
