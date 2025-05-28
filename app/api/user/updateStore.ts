// In-memory store to simulate socket-like persistent connections
// This allows clients to long-poll for updates
export interface Update {
  type: string;
  data: any;
  timestamp: number;
}

export interface UserSession {
  userId: string;
  lastUpdate: number;
  updates: Update[];
}

export const userSessions: Record<string, UserSession> = {};

// Helper to add an update to a user's session queue
export const addUserUpdate = (userId: string, updateType: string, data: any) => {
  if (!userSessions[userId]) {
    userSessions[userId] = {
      userId,
      lastUpdate: Date.now(),
      updates: []
    };
  }
  
  userSessions[userId].updates.push({
    type: updateType,
    data,
    timestamp: Date.now()
  });
  
  // Keep only last 20 updates
  if (userSessions[userId].updates.length > 20) {
    userSessions[userId].updates = userSessions[userId].updates.slice(-20);
  }

  console.log(`Added update for user ${userId}: ${updateType}`);
};

// Get updates for a user
export const getUserUpdates = (userId: string): Update[] => {
  if (!userSessions[userId]) {
    return [];
  }
  
  const updates = [...userSessions[userId].updates];
  
  // Clear updates after retrieving
  userSessions[userId].updates = [];
  
  return updates;
};

// Clean up old sessions (can be called periodically)
export const cleanupSessions = (): void => {
  const now = Date.now();
  const expireTime = 24 * 60 * 60 * 1000; // 24 hours
  
  Object.keys(userSessions).forEach(userId => {
    if (now - userSessions[userId].lastUpdate > expireTime) {
      delete userSessions[userId];
    }
  });
}; 