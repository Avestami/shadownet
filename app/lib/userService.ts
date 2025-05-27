import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User, UserSession } from '../models/user';

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({}));
}

if (!fs.existsSync(SESSIONS_FILE)) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}));
}

// Read data
const readUsers = (): Record<string, User> => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return {};
  }
};

const readSessions = (): Record<string, UserSession> => {
  try {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading sessions file:', error);
    return {};
  }
};

// Write data
const writeUsers = (users: Record<string, User>) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

const writeSessions = (sessions: Record<string, UserSession>) => {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Error writing sessions file:', error);
  }
};

// User operations
export const createUser = (username: string): User => {
  const users = readUsers();
  
  // Check if username already exists
  const existingUser = Object.values(users).find(user => user.username === username);
  if (existingUser) {
    return existingUser;
  }
  
  // Create new user
  const userId = uuidv4();
  const newUser: User = {
    username,
    userId,
    score: 0,
    choices: {},
    unlockedLevels: ['level1'] // Level 1 is always unlocked by default
  };
  
  users[userId] = newUser;
  writeUsers(users);
  
  return newUser;
};

export const getUser = (userId: string): User | null => {
  const users = readUsers();
  return users[userId] || null;
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = readUsers();
  const user = users[userId];
  
  if (!user) {
    return null;
  }
  
  const updatedUser = { ...user, ...updates };
  users[userId] = updatedUser;
  writeUsers(users);
  
  return updatedUser;
};

// Session operations
export const createSession = (userId: string, username: string): UserSession => {
  const sessions = readSessions();
  
  // Check if session already exists
  const existingSession = Object.values(sessions).find(
    session => session.userId === userId
  );
  
  if (existingSession) {
    existingSession.lastActive = Date.now();
    writeSessions(sessions);
    return existingSession;
  }
  
  // Create new session
  const session: UserSession = {
    userId,
    username,
    lastActive: Date.now()
  };
  
  sessions[userId] = session;
  writeSessions(sessions);
  
  return session;
};

export const getSession = (userId: string): UserSession | null => {
  const sessions = readSessions();
  return sessions[userId] || null;
};

// Score operations
export const updateScore = (userId: string, deltaScore: number): number => {
  const users = readUsers();
  const user = users[userId];
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  user.score += deltaScore;
  writeUsers(users);
  
  return user.score;
};

export const getScore = (userId: string): number => {
  const user = getUser(userId);
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  return user.score;
};

// Choice operations
export const saveChoice = (
  userId: string, 
  levelId: string, 
  choice: string
): Record<string, string> => {
  const users = readUsers();
  const user = users[userId];
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  user.choices[levelId] = choice;
  writeUsers(users);
  
  return user.choices;
};

export const getChoices = (userId: string): Record<string, string> => {
  const user = getUser(userId);
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  return user.choices;
};

// Level operations
export const unlockLevel = (
  userId: string, 
  levelId: string
): string[] => {
  const users = readUsers();
  const user = users[userId];
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  if (!user.unlockedLevels.includes(levelId)) {
    user.unlockedLevels.push(levelId);
    writeUsers(users);
  }
  
  return user.unlockedLevels;
};

export const getUnlockedLevels = (userId: string): string[] => {
  const user = getUser(userId);
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  return user.unlockedLevels;
}; 