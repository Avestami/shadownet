export interface User {
  id: string;
  username: string;
  email: string | null;
  password: string;
<<<<<<< HEAD
  karma: Record<string, number> | null;
  choices: string[];  // Array of choice identifiers
=======
  karma: Record<string, number> | number | null;
  choices: string | string[];  // Can be a JSON string or an array of choice identifiers
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
  flagsCaptured: string[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sessions?: any[];
  unlockedLevels?: any[];
  playerChoices?: any[];
} 