export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  prerequisites: string[];
  rewards: {
    xp: number;
    items?: string[];
  };
  objectives: {
    id: string;
    description: string;
    completed: boolean;
  }[];
}

export const missionData: { [key: string]: Mission } = {
  'tutorial': {
    id: 'tutorial',
    title: 'System Introduction',
    description: 'Learn the basics of the ShadowNet terminal system.',
    difficulty: 'easy',
    status: 'available',
    prerequisites: [],
    rewards: {
      xp: 100,
    },
    objectives: [
      {
        id: 'obj1',
        description: 'Access the terminal',
        completed: false,
      },
      {
        id: 'obj2',
        description: 'Complete basic command training',
        completed: false,
      },
    ],
  },
  'first_hack': {
    id: 'first_hack',
    title: 'First Breach',
    description: 'Complete your first system breach.',
    difficulty: 'easy',
    status: 'locked',
    prerequisites: ['tutorial'],
    rewards: {
      xp: 200,
      items: ['basic_toolkit'],
    },
    objectives: [
      {
        id: 'obj1',
        description: 'Identify target system',
        completed: false,
      },
      {
        id: 'obj2',
        description: 'Bypass security',
        completed: false,
      },
      {
        id: 'obj3',
        description: 'Extract data',
        completed: false,
      },
    ],
  },
  // Add more missions as needed
}; 