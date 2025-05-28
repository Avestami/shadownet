export interface User {
  id: string;
  username: string;
  email: string | null;
  password: string;
  karma: number;
  choices: string;  // JSON string
  flagsCaptured: string[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sessions?: any[];
  unlockedLevels?: any[];
  playerChoices?: any[];
} 