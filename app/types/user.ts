export interface User {
  id: string;
  username: string;
  email: string | null;
  password: string;
  karma: Record<string, number> | null;
  choices: string[];  // Array of choice identifiers
  flagsCaptured: string[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sessions?: any[];
  unlockedLevels?: any[];
  playerChoices?: any[];
} 