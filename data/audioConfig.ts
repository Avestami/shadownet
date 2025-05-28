export interface AudioConfig {
  src: string;
  volume: number;
  loop: boolean;
  description: string;
  theme: string;
}

export const levelAudioConfig: Record<string, AudioConfig> = {
  alpha: {
    src: '/audio/alpha.mp3',
    volume: 0.3,
    loop: true,
    description: 'Dark ambient cyberpunk with Persian musical elements',
    theme: 'Underground resistance, infiltration, hope in darkness'
  },
  beta: {
    src: '/audio/beta.mp3',
    volume: 0.3,
    loop: true,
    description: 'Tense electronic with glitchy elements, surveillance paranoia',
    theme: 'Being watched, digital surveillance, protecting others'
  },
  gamma: {
    src: '/audio/gamma.mp3',
    volume: 0.3,
    loop: true,
    description: 'Haunting digital soundscape with distorted voices and static',
    theme: 'AI mimicry, lost souls, digital ghosts'
  },
  delta: {
    src: '/audio/delta.mp3',
    volume: 0.3,
    loop: true,
    description: 'Melancholic cyberpunk with mechanical undertones',
    theme: 'Sacrifice, truth revelation, dismantling systems'
  },
  sigma: {
    src: '/audio/sigma.mp3',
    volume: 0.3,
    loop: true,
    description: 'Triumphant electronic with martial elements, freedom signals',
    theme: 'Liberation, overriding AI control, flooding with freedom'
  },
  theta: {
    src: '/audio/theta.mp3',
    volume: 0.3,
    loop: true,
    description: 'Disorienting dual-layered tracks, identity crisis soundscape',
    theme: 'Self-confrontation, identity, digital duality'
  },
  zeta: {
    src: '/audio/zeta.mp3',
    volume: 0.3,
    loop: true,
    description: 'Urgent electronic with youthful energy, coding rhythms',
    theme: 'Protecting the young, fixing corruption, taking risks'
  },
  'sigma-2': {
    src: '/audio/sigma-2.mp3',
    volume: 0.3,
    loop: true,
    description: 'Religious/spiritual cyberpunk with confession booth atmosphere',
    theme: 'Digital worship, deletion, legacy erasure'
  },
  omega: {
    src: '/audio/omega.mp3',
    volume: 0.3,
    loop: true,
    description: 'Epic, transcendent cyberpunk with consciousness-merging themes',
    theme: 'Final choice, consciousness injection, ultimate sacrifice'
  }
};

export const specialAudioConfig: Record<string, AudioConfig> = {
  ending: {
    src: '/audio/ending.mp3',
    volume: 0.2,
    loop: true,
    description: 'Contemplative ending theme with resolution undertones',
    theme: 'Reflection, consequences, final judgment'
  },
  menu: {
    src: '/audio/alpha.mp3', // Use alpha as default menu music
    volume: 0.2,
    loop: true,
    description: 'Ambient cyberpunk menu theme',
    theme: 'Anticipation, preparation, entering the Grid'
  }
};

export const getAudioConfig = (levelId: string): AudioConfig => {
  return levelAudioConfig[levelId] || levelAudioConfig.alpha;
};

export const getSpecialAudioConfig = (type: string): AudioConfig => {
  return specialAudioConfig[type] || specialAudioConfig.menu;
}; 