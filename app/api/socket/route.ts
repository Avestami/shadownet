import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { NextResponse } from 'next/server';
import { registerSocketHandlers } from '../socket-handlers';

// Level-specific data that was previously in the LEVEL_FLAVOR object
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

// Socket.io server instance
let io: SocketIOServer;

// Initialize socket.io if it hasn't been initialized yet
function initSocketIO(req: NextApiRequest, res: any) {
  if (!io) {
    console.log('Initializing Socket.IO server');
    
    // @ts-ignore - NextApiResponse incompatible with Socket.io
    io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['polling'], // Use polling instead of WebSocket
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    
    // @ts-ignore
    res.socket.server.io = io;
    
    // Register socket handlers
    registerSocketHandlers(io);
  }
}

export async function GET(req: Request) {
  // The actual socket.io handling will happen via the socket.io-client 
  // This route exists just to initialize the socket server
  return NextResponse.json({ message: 'Socket.IO server initialized' });
}

// The actual socket.io handling requires API Routes, which we're 
// simulating through client-side code in this implementation
// In a real implementation, this would use pages/api/ directory with API Routes 