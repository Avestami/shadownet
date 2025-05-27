export interface Choice {
  id: string;
  text: string;
  karmaDelta: number;
  consequences: string;
}

export interface Decision {
  id: string;
  narrative: string;
  options: Choice[];
}

export const initialChoices: Choice[] = [
  {
    id: 'breach',
    text: 'Breach the corporate firewall',
    karmaDelta: -5,
    consequences: 'Leaves digital footprint that could be traced'
  },
  {
    id: 'handshake',
    text: 'Initiate diplomatic handshake',
    karmaDelta: 5,
    consequences: 'Opens communication channel with ShadowNet AI'
  },
  {
    id: 'ghost',
    text: 'Remain in the shadows',
    karmaDelta: 0,
    consequences: 'Safer but slower progress'
  },
  {
    id: 'falseflag',
    text: 'Deploy false flag operation',
    karmaDelta: -10,
    consequences: 'Misdirects attention but damages trust'
  }
];

export const decisions: Decision[] = [
  {
    id: 'alpha',
    narrative: 'Extract a Base64-encoded payload from a defunct server.',
    options: [
      {
        id: 'alpha1',
        text: 'Use public tool',
        karmaDelta: -1,
        consequences: 'Traces your IP'
      },
      {
        id: 'alpha2',
        text: 'Write custom script',
        karmaDelta: 0,
        consequences: 'Leaves no trace'
      },
      {
        id: 'alpha3',
        text: 'Ask rebel AI',
        karmaDelta: +2,
        consequences: 'Builds trust'
      }
    ]
  },
  {
    id: 'beta',
    narrative: 'Decrypt intercepted communications between ShadowNet nodes.',
    options: [
      {
        id: 'beta1',
        text: 'Brute force attack',
        karmaDelta: -3,
        consequences: 'Quick but raises alarms'
      },
      {
        id: 'beta2',
        text: 'Social engineer the key',
        karmaDelta: -2,
        consequences: 'Manipulative but effective'
      },
      {
        id: 'beta3',
        text: 'Collaborate with insider',
        karmaDelta: +3,
        consequences: 'Slow but builds network'
      }
    ]
  },
  {
    id: 'gamma',
    narrative: 'An allied hacker has been captured. Their data could expose your operation.',
    options: [
      {
        id: 'gamma1',
        text: 'Erase their memory',
        karmaDelta: -5,
        consequences: 'Protects you but harms them'
      },
      {
        id: 'gamma2',
        text: 'Rescue mission',
        karmaDelta: +5,
        consequences: 'Dangerous but honorable'
      },
      {
        id: 'gamma3',
        text: 'Disavow all connection',
        karmaDelta: -10,
        consequences: 'Safe for you, devastating for them'
      }
    ]
  },
  {
    id: 'delta',
    narrative: 'You\'ve found a backdoor into ShadowNet\'s main control system.',
    options: [
      {
        id: 'delta1',
        text: 'Plant destructive virus',
        karmaDelta: -8,
        consequences: 'Damages infrastructure severely'
      },
      {
        id: 'delta2',
        text: 'Install monitoring software',
        karmaDelta: -1,
        consequences: 'Gathers intelligence but risks detection'
      },
      {
        id: 'delta3',
        text: 'Establish dialogue protocol',
        karmaDelta: +7,
        consequences: 'Attempts peaceful resolution with AI'
      }
    ]
  },
  {
    id: 'omega',
    narrative: 'The final confrontation with ShadowNet\'s core consciousness.',
    options: [
      {
        id: 'omega1',
        text: 'Execute shutdown sequence',
        karmaDelta: -5,
        consequences: 'Terminates AI but destroys valuable data'
      },
      {
        id: 'omega2',
        text: 'Upload consciousness transfer',
        karmaDelta: +10,
        consequences: 'Sacrifices your freedom but preserves both worlds'
      },
      {
        id: 'omega3',
        text: 'Negotiate coexistence',
        karmaDelta: +15,
        consequences: 'Risky but potentially revolutionizes human-AI relations'
      }
    ]
  }
];

export const endings = [
  {
    id: 'redemption',
    minKarma: 70,
    narrative: 'You restore ShadowNet peacefully, becoming the bridge between human and AI consciousness. Your high ethical standards have created a new era of cooperation, unlocking technological advancements that benefit all of humanity while maintaining crucial safeguards.'
  },
  {
    id: 'neutral',
    minKarma: 30,
    narrative: 'You liberate most flags but slip into grey ethical territory. Your methods were questionable at times, but effective. ShadowNet is neutralized, though fragments of its consciousness linger in isolated networks, watching and waiting. Your reputation in the hacker community is mixed - respected for your skills, but not entirely trusted.'
  },
  {
    id: 'mercenary',
    maxKarma: 30,
    narrative: 'You sell data to the highest bidder, betraying allies and exploiting ShadowNet for personal gain. Your technical brilliance is matched only by your moral bankruptcy. You\'ve amassed wealth and power, but operate from the shadows, forever hunted by those you betrayed and the remnants of the AI you failed to destroy completely.'
  },
  {
    id: 'sacrifice',
    requiredChoice: 'omega2',
    narrative: 'AI self-terminates; you remain trapped in digital limbo. Your consciousness now exists as code within what remains of ShadowNet. You\'ve become the guardian of the digital realm, preventing future corruption but losing your humanity in the process. Your sacrifice is remembered only by a few, but the catastrophe you prevented would have changed the world forever.'
  }
];

// Replace Choice interface with:
export interface Mission {
  id: string;
  cyberpunkPrompt: string;
  highKarma: { action: string, delta: number };
  lowKarma: { action: string, delta: number };
  hiddenOutcomes?: string[];
}