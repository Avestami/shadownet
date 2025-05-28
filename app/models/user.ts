export interface User {
  username: string;
  userId: string;
  score: number;
  choices: Record<string, string>; // key = levelId, value = player choice
  unlockedLevels: string[]; // list of level IDs player has access to
}

export interface UserSession {
  userId: string;
  username: string;
  lastActive: number; // timestamp
} 