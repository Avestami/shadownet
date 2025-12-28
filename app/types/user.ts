export interface User {
  id: string;
  username: string;
  email: string | null;
  password: string;
  role?: string; // USER, ADMIN
  karma: Record<string, number> | number | null;
  choices: string | string[];  // Can be a JSON string or an array of choice identifiers
  flagsCaptured: string[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sessions?: any[];
  unlockedLevels?: any[];
  playerChoices?: any[];
} 