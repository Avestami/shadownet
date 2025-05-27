export interface MissionData {
  id: string;
  narration: string;
  prompt: string;
  yesKarma: number;
  noKarma: number;
}

export const missionData: Record<string, MissionData> = {
  alpha: {
    id: 'alpha',
    narration: "The Grid's burned. Towers hum with silence. You intercept a shard of a forgotten protocol under Azadi Tower — the last whisper of the resistance.",
    prompt: "Decrypt the data and leave no trace? The protocol could save others… or end you.",
    yesKarma: 1,
    noKarma: 0
  },
  beta: {
    id: 'beta',
    narration: "Inside the skeletal remains of Tehran Tech Campus, you find a cipher that's tracking old rebels. You're being watched.",
    prompt: "Do you scramble the signatures and protect their trail?",
    yesKarma: 1,
    noKarma: -1
  },
  gamma: {
    id: 'gamma',
    narration: "A child's voice bleeds through static. AI ghosts use old comms to mimic lost ones. They want access to your key.",
    prompt: "Respond and send a counter-script to silence them for good?",
    yesKarma: -1,
    noKarma: 1
  },
  delta: {
    id: 'delta',
    narration: "An ex-agent, half-machine, left logs before deletion. His truth could dismantle the Sovereign Protocol.",
    prompt: "Do you release the truth, risking every safehouse and node?",
    yesKarma: 1,
    noKarma: -1
  },
  sigma: {
    id: 'sigma',
    narration: "The servers of District 14 still run under martial AI rule. You find their override pass hidden in visual noise.",
    prompt: "Input the override and flood the local grid with freedom signals?",
    yesKarma: 1,
    noKarma: 0
  },
  theta: {
    id: 'theta',
    narration: "You see a clone of yourself in the logs. A decoy left by the system. They are tracing both of you.",
    prompt: "Erase the clone to protect yourself?",
    yesKarma: -1,
    noKarma: 1
  },
  zeta: {
    id: 'zeta',
    narration: "A group of teenage coders sent a corrupted key to the resistance. It'll blow their cover.",
    prompt: "Do you fix it and risk getting flagged on the net?",
    yesKarma: 1,
    noKarma: -1
  },
  'sigma-2': {
    id: 'sigma-2',
    narration: "You decode an audio file: a confessional from the first AI-worship cultist. He's begging to be deleted.",
    prompt: "Delete his logs to erase his legacy?",
    yesKarma: -1,
    noKarma: 1
  },
  omega: {
    id: 'omega',
    narration: "You've reached the Heart of the Ghost Grid. The final cipher holds the fate of memory, identity, and the truth of what started it all.",
    prompt: "Do you inject your consciousness into the Grid, knowing you won't return?",
    yesKarma: 1,
    noKarma: -2
  }
};

// Karma-based endings
export const getEnding = (totalKarma: number): string => {
  if (totalKarma >= 4) {
    return "Liberator of the Ghost Grid";
  } else if (totalKarma >= 0) {
    return "The One Who Walked Through the Ash";
  } else {
    return "You Became What You Fought";
  }
};

export const getEndingDescription = (ending: string): string => {
  switch (ending) {
    case "Liberator of the Ghost Grid":
      return "You chose the path of light in the digital darkness. Your actions saved countless souls trapped in the Grid. The resistance remembers your name.";
    case "The One Who Walked Through the Ash":
      return "You navigated the gray zones between right and wrong. Your journey was one of survival and pragmatism. The Grid neither embraces nor rejects you.";
    case "You Became What You Fought":
      return "The darkness consumed you. In fighting the system, you became the very thing you sought to destroy. The Grid claims another soul.";
    default:
      return "Your journey has ended, but your story continues in the digital void.";
  }
};