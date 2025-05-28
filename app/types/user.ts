export interface User {
  id: string;
  username: string;
  email: string | null;
  password: string;
  score: number;
  karma: number;
  choices: string;  // JSON string
  flagsCaptured: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sessions?: any[];
  unlockedLevels?: any[];
  playerChoices?: any[];
} 