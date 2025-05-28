import { Server as SocketIOServer, Socket } from 'socket.io';
import { userSessions, addUserUpdate } from './user/updateStore';

// Level-specific data
const LEVEL_DATA = {
  'alpha': {
    title: 'Initial Access',
    subtitle: 'Breach the first layer of ShadowNet',
    serverName: 'perimeter-server-01',
    terminalWelcome: 'Connection established to ShadowNet peripheral system.\nBreaching security layers...\nAccess level: Alpha',
  },
  'beta': {
    title: 'Network Infiltration',
    subtitle: 'Navigate the internal network',
    serverName: 'network-hub-42',
    terminalWelcome: 'Connection established to ShadowNet network hub.\nTraffic analysis in progress...\nAccess level: Beta',
  },
  'gamma': {
    title: 'Data Extraction',
    subtitle: 'Access the protected databases',
    serverName: 'db-cluster-prime',
    terminalWelcome: 'Connection established to ShadowNet database.\nData extraction protocols active...\nAccess level: Gamma',
  },
  'delta': {
    title: 'System Override',
    subtitle: 'Gain control of core functions',
    serverName: 'core-systems-01',
    terminalWelcome: 'Connection established to ShadowNet core.\nOverride protocols initiated...\nAccess level: Delta',
  },
  'omega': {
    title: 'Final Confrontation',
    subtitle: 'Face the AI consciousness',
    serverName: 'ai-nexus-omega',
    terminalWelcome: 'Connection established to ShadowNet AI nexus.\nAI consciousness detected...\nWarning: Defense systems active\nAccess level: Omega',
  }
};

export interface SocketHandlers {
  [key: string]: (socket: Socket, data: any) => void;
}

export const socketHandlers: SocketHandlers = {
  // Handle level info requests
  getLevelInfo: (socket: Socket, { levelId }: { levelId: string }) => {
    const levelInfo = LEVEL_DATA[levelId as keyof typeof LEVEL_DATA] || {
      title: 'Unknown Level',
      subtitle: 'Navigate with caution',
      serverName: 'unknown',
      terminalWelcome: 'Connection established to unknown system.',
    };
    
    socket.emit('levelInfo', levelInfo);
    
    // Add a simulated response from Avesta after a delay
    const userId = socket.data.userId || 'unknown';
    setTimeout(() => {
      const avestaMessages = [
        `Welcome to ${levelInfo.title}. I've been waiting for you.`,
        `This server holds secrets. Choose your actions carefully.`,
        `I sense your presence in the ${levelInfo.serverName} system.`,
        `The network has been compromised. You are not alone here.`
      ];
      
      const randomMessage = avestaMessages[Math.floor(Math.random() * avestaMessages.length)];
      
      // Add to user's update queue
      addUserUpdate(userId, 'avesta_message', {
        message: randomMessage,
        levelId
      });
      
      // Also emit directly if socket is still connected
      if (socket.connected) {
        socket.emit('avesta_message', {
          message: randomMessage,
          levelId
        });
      }
    }, 5000);
  },
  
  // Track player choices
  makeChoice: (socket: Socket, { levelId, choiceId }: { levelId: string, choiceId: string }) => {
    console.log(`User ${socket.id} made choice ${choiceId} on level ${levelId}`);
    
    // Add to update queue for this user
    const userId = socket.data.userId || 'unknown';
    addUserUpdate(userId, 'choice_made', {
      levelId,
      choiceId,
      timestamp: Date.now()
    });
    
    // Broadcast to admin dashboard if needed
    socket.broadcast.emit('player_choice', {
      socketId: socket.id,
      userId,
      levelId,
      choiceId
    });
  },
  
  // Track flag captures
  captureFlag: (socket: Socket, { levelId }: { levelId: string }) => {
    console.log(`User ${socket.id} captured flag on level ${levelId}`);
    
    // Add to update queue for this user
    const userId = socket.data.userId || 'unknown';
    addUserUpdate(userId, 'flag_captured', {
      levelId,
      timestamp: Date.now()
    });
    
    // Broadcast to admin dashboard or leaderboard
    socket.broadcast.emit('flag_captured', {
      socketId: socket.id,
      userId,
      levelId
    });
  },
  
  // Track crypto challenge completion
  cryptoSolved: (socket: Socket, { levelId, key }: { levelId: string, key: string }) => {
    console.log(`User ${socket.id} solved crypto challenge on level ${levelId} with key ${key}`);
    
    // Add to update queue for this user
    const userId = socket.data.userId || 'unknown';
    addUserUpdate(userId, 'crypto_solved', {
      levelId,
      key,
      timestamp: Date.now()
    });
    
    // Generate Avesta response
    setTimeout(() => {
      const avestaMessages = [
        `You've broken through the encryption. I'm impressed.`,
        `This key is just the beginning. There are more secrets to find.`,
        `You're showing skill. The system will notice.`,
        `Well done. Keep progressing through the network layers.`
      ];
      
      const randomMessage = avestaMessages[Math.floor(Math.random() * avestaMessages.length)];
      
      // Add to user's update queue
      addUserUpdate(userId, 'avesta_message', {
        message: randomMessage,
        levelId,
        event: 'crypto_solved'
      });
      
      // Also emit directly if socket is still connected
      if (socket.connected) {
        socket.emit('avesta_message', {
          message: randomMessage,
          levelId,
          event: 'crypto_solved'
        });
      }
    }, 2000);
  }
};

export const registerSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);
    
    // Extract userId from handshake auth or query
    const userId = socket.handshake.auth.userId || 
                   socket.handshake.query.userId || 
                   'unknown';
    
    // Store userId in socket data for later use
    socket.data.userId = userId as string;
    
    // Register handlers
    Object.entries(socketHandlers).forEach(([event, handler]) => {
      socket.on(event, (data) => handler(socket, data));
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
}; 