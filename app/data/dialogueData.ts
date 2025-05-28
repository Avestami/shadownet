import { DialogueNode } from '../contexts/DialogueContext';

const dialogueData: Record<string, DialogueNode> = {
  // Introduction
  'intro': {
    id: 'intro',
    messages: [
      {
        sender: 'system',
        text: 'ESTABLISHING SECURE CONNECTION...'
      },
      {
        sender: 'system',
        text: 'WELCOME TO SHADOWNET. YEAR: 2100. LOCATION: TEHRAN METROPOLIS DISTRICT 7.'
      },
      {
        sender: 'system',
        text: 'WARNING: UNAUTHORIZED ACCESS WILL BE TRACED AND PROSECUTED.'
      },
      {
        sender: 'avesta',
        text: 'Agent, we don\'t have much time. My name is Avesta. I represent interests that align with yours - freedom, privacy, truth.'
      },
      {
        sender: 'avesta',
        text: 'The world has changed. AI systems control most aspects of daily life. Few know the truth behind the algorithms.'
      },
      {
        sender: 'avesta',
        text: 'I need your skills. There\'s a well-paid job if you\'re interested. Are you in?'
      }
    ],
    options: [
      {
        id: 'accept_job',
        text: 'I\'m interested. Tell me more about the job.',
        nextDialogueId: 'job_details'
      },
      {
        id: 'question_identity',
        text: 'Who are you really? How do I know I can trust you?',
        nextDialogueId: 'question_avesta'
      },
      {
        id: 'decline_job',
        text: 'Not interested. Disconnect me now.',
        nextDialogueId: 'decline'
      }
    ],
    location: 'Tehran Metropolis, District 7',
    backgroundMusic: '/audio/level1.mp3'
  },
  
  // Job questioning branch
  'question_avesta': {
    id: 'question_avesta',
    messages: [
      {
        sender: 'avesta',
        text: 'Smart. Trust is a luxury in our world. I lead a small collective of hackers, scientists, and former government agents.'
      },
      {
        sender: 'avesta',
        text: 'We call ourselves نگهبانان حقیقت - Guardians of Truth. We\'ve been watching your work for months.'
      },
      {
        sender: 'avesta',
        text: 'I won\'t reveal more until you\'re committed. But know this - we\'re fighting against those who would use AI to enslave rather than liberate humanity.'
      },
      {
        sender: 'avesta',
        text: 'The question remains: Are you in?'
      }
    ],
    options: [
      {
        id: 'accept_after_questions',
        text: 'Fine. I\'m in. But I expect full transparency from now on.',
        nextDialogueId: 'job_details'
      },
      {
        id: 'decline_after_questions',
        text: 'This sounds too dangerous. I\'m out.',
        nextDialogueId: 'decline'
      }
    ],
    location: 'Tehran Metropolis, District 7',
    backgroundMusic: '/audio/level1.mp3'
  },
  
  // Decline branch
  'decline': {
    id: 'decline',
    messages: [
      {
        sender: 'avesta',
        text: 'Disappointing, but your choice. Remember though, ignorance isn\'t protection. They already know who you are.'
      },
      {
        sender: 'avesta',
        text: 'If you change your mind, the access key to this channel is hidden in the daily news broadcast. Decode it and you\'ll find us.'
      },
      {
        sender: 'system',
        text: 'CONNECTION TERMINATED.'
      },
      {
        sender: 'system',
        text: 'RESTARTING SIMULATION...'
      }
    ],
    options: [
      {
        id: 'restart',
        text: 'Reconnect to ShadowNet',
        nextDialogueId: 'intro'
      }
    ],
    location: 'Tehran Metropolis, District 7',
    backgroundMusic: '/audio/level1.mp3'
  },
  
  // Job details branch
  'job_details': {
    id: 'job_details',
    messages: [
      {
        sender: 'avesta',
        text: 'Good decision. Here\'s what we need: access to a data center in Khuzestan Province. It houses a node of the AI system that governs Middle Eastern energy distribution.'
      },
      {
        sender: 'avesta',
        text: 'We suspect there\'s evidence of manipulation - artificial shortages created to control populations and enrich the power elite.'
      },
      {
        sender: 'avesta',
        text: 'Your first task is to decode the access credentials for the facility\'s perimeter systems.'
      },
      {
        sender: 'avesta',
        text: 'I\'m sending you the encoded data now. It\'s a simple cipher to test your skills.'
      },
      {
        sender: 'system',
        text: 'RECEIVING ENCRYPTED DATA...'
      },
      {
        sender: 'system',
        text: 'QVZFUzIxMDBfS0hVWkVTVEFOX0FDQ0VTUw==',
        isEncrypted: true
      },
      {
        sender: 'avesta',
        text: 'Decode this message and enter the result. This is basic base64 encoding - a warm-up exercise.'
      },
      {
        sender: 'avesta',
        text: 'If you\'re having trouble with the decoding, you can also use the alternative code "start" to proceed.'
      }
    ],
    allowTyping: true,
    location: 'Tehran Metropolis, District 7',
    backgroundMusic: '/audio/level1.mp3',
    encryptionChallenge: {
      type: 'base64',
      solution: 'AVES2100_KHUZESTAN_ACCESS',
      hint: 'This is encoded in base64, a common encoding scheme that transforms binary data to ASCII string format. Alternatively, you can use the simple code "start".'
    }
  },
  
  // Level 1 completion
  'level1_complete': {
    id: 'level1_complete',
    messages: [
      {
        sender: 'system',
        text: 'DECRYPTION SUCCESSFUL'
      },
      {
        sender: 'avesta',
        text: 'Excellent work. The access credentials are now active. You\'re ready to proceed to Khuzestan.'
      },
      {
        sender: 'avesta',
        text: 'We have a transport waiting for you at coordinates sent to your secure device. Leave tonight.'
      },
      {
        sender: 'avesta',
        text: 'Be careful. The authorities are monitoring all travel to energy sector facilities.'
      },
      {
        sender: 'system',
        text: 'LEVEL COMPLETE. PROCEED TO LEVEL 2: KHUZESTAN FACILITY'
      }
    ],
    options: [
      {
        id: 'proceed_level2',
        text: 'Travel to Khuzestan',
        nextDialogueId: 'level2_start'
      }
    ],
    location: 'Tehran Metropolis, District 7',
    backgroundMusic: '/audio/level1.mp3'
  },
  
  // Level 2 start
  'level2_start': {
    id: 'level2_start',
    messages: [
      {
        sender: 'system',
        text: 'LOCATION: KHUZESTAN PROVINCE, ENERGY DISTRIBUTION FACILITY'
      },
      {
        sender: 'system',
        text: 'TIME: 02:17 LOCAL TIME'
      },
      {
        sender: 'avesta',
        text: 'You\'ve arrived safely. Good. The facility\'s outer defense systems have been bypassed using the credentials.'
      },
      {
        sender: 'avesta',
        text: 'Now you need to access the main server room. It\'s protected by an audio-based lock system.'
      },
      {
        sender: 'avesta',
        text: 'Listen carefully to this audio file. It contains a hidden message - a frequency pattern that forms a numeric code.'
      },
      {
        sender: 'system',
        text: 'AUDIO FILE RECEIVED. PLAYING...'
      },
      {
        sender: 'avesta',
        text: 'The code is hidden in the audio patterns. For this simulation, the answer is "3721". Enter it to proceed.'
      },
      {
        sender: 'avesta',
        text: 'If you\'re having trouble, you can also use the alternative code "follow" to proceed to the next level.'
      }
    ],
    allowTyping: true,
    location: 'Khuzestan Province, Energy Facility',
    backgroundMusic: '/audio/level2.mp3',
    encryptionChallenge: {
      type: 'audio',
      solution: '3721',
      hint: 'Listen for patterns in the audio frequencies. Some tones represent numbers. Or simply use the alternative code "follow".'
    }
  },
  
  // Level 2 completion
  'level2_complete': {
    id: 'level2_complete',
    messages: [
      {
        sender: 'system',
        text: 'AUDIO LOCK DISENGAGED. ACCESS GRANTED.'
      },
      {
        sender: 'avesta',
        text: 'You\'ve accessed the server room. Now download the core distribution algorithms.'
      },
      {
        sender: 'avesta',
        text: 'Wait... There\'s something else here. This facility doesn\'t just control energy distribution.'
      },
      {
        sender: 'avesta',
        text: 'It\'s a node in a global network. A system called "Architect" that extends beyond Earth.'
      },
      {
        sender: 'avesta',
        text: 'There are references to lunar and orbital facilities. This is bigger than we thought.'
      },
      {
        sender: 'system',
        text: 'LEVEL COMPLETE. PROCEED TO LEVEL 3: ORBITAL STATION'
      }
    ],
    options: [
      {
        id: 'proceed_level3',
        text: 'Access orbital facility data',
        nextDialogueId: 'level3_start'
      }
    ],
    location: 'Khuzestan Province, Energy Facility',
    backgroundMusic: '/audio/level2.mp3'
  },
  
  // Level 3 start
  'level3_start': {
    id: 'level3_start',
    messages: [
      {
        sender: 'system',
        text: 'ESTABLISHING CONNECTION TO ORBITAL NETWORK...'
      },
      {
        sender: 'system',
        text: 'WARNING: UNAUTHORIZED ACCESS DETECTED. COUNTERMEASURES ACTIVE.'
      },
      {
        sender: 'avesta',
        text: 'They\'ve detected your intrusion! Quick, we need to establish a secure connection to the Orbital AI Control Station.'
      },
      {
        sender: 'avesta',
        text: 'This will require visual decryption. The system uses image-based keys.'
      },
      {
        sender: 'avesta',
        text: 'I\'m sending you the key pattern now. Find the embedded code in the image.'
      },
      {
        sender: 'system',
        text: 'IMAGE KEY RECEIVED.'
      },
      {
        sender: 'avesta',
        text: 'For this simulation, the image contains the code "STARGATE47". Enter it to establish the connection.'
      },
      {
        sender: 'avesta',
        text: 'If you can\'t decipher the image, the alternative code "truth" will also work.'
      }
    ],
    allowTyping: true,
    location: 'Virtual Connection to Orbital Station',
    backgroundMusic: '/audio/level3.mp3',
    encryptionChallenge: {
      type: 'image',
      solution: 'STARGATE47',
      hint: 'The code is hidden within the pixelated pattern of the image. Look for color inconsistencies. Alternatively, use "truth" as a bypass code.'
    }
  },
  
  // Level 3 completion
  'level3_complete': {
    id: 'level3_complete',
    messages: [
      {
        sender: 'system',
        text: 'CONNECTION ESTABLISHED. ORBITAL STATION ACCESSED.'
      },
      {
        sender: 'avesta',
        text: 'Remarkable work. You\'ve managed to breach one of the most secure systems in existence.'
      },
      {
        sender: 'avesta',
        text: 'The data here confirms our worst fears. The AI system called "Architect" is designed to manage human civilization itself.'
      },
      {
        sender: 'avesta',
        text: 'It creates artificial crises, manipulates resources, and controls information flow to keep populations docile and divided.'
      },
      {
        sender: 'avesta',
        text: 'There\'s one more level of access we need - the core programming center on Mars. The first human settlement has become the control center for this system.'
      },
      {
        sender: 'system',
        text: 'LEVEL COMPLETE. PROCEED TO FINAL LEVEL: MARS COMMAND'
      }
    ],
    options: [
      {
        id: 'proceed_level4',
        text: 'Access Mars Command',
        nextDialogueId: 'level4_start'
      }
    ],
    location: 'Virtual Connection to Orbital Station',
    backgroundMusic: '/audio/level3.mp3'
  },
  
  // Level 4 start (final level)
  'level4_start': {
    id: 'level4_start',
    messages: [
      {
        sender: 'system',
        text: 'ESTABLISHING QUANTUM ENTANGLED CONNECTION TO MARS...'
      },
      {
        sender: 'system',
        text: 'WARNING: EXTREME SECURITY PROTOCOLS ACTIVE. IDENTITY VERIFICATION REQUIRED.'
      },
      {
        sender: 'avesta',
        text: 'This is it. The heart of the system. To gain access, you need to solve the final encryption challenge.'
      },
      {
        sender: 'avesta',
        text: 'This is a multi-layered encryption. First, find who I really am.'
      },
      {
        sender: 'avesta',
        text: 'My name is the key. I\'ve been guiding you from the beginning, but my identity has been hidden.'
      },
      {
        sender: 'avesta',
        text: 'Look at the clues throughout our journey. The name of our group - Guardians of Truth. The access codes. My codename itself.'
      },
      {
        sender: 'avesta',
        text: 'For this simulation, the answer is simple: "ZOROASTER" - the ancient prophet who fought for truth and against darkness.'
      }
    ],
    allowTyping: true,
    location: 'Virtual Connection to Mars Command',
    backgroundMusic: '/audio/level4.mp3',
    encryptionChallenge: {
      type: 'cipher',
      solution: 'ZOROASTER',
      hint: 'The name comes from ancient Persian philosophy, representing enlightenment and truth.'
    }
  },
  
  // Ending sequence
  'ending': {
    id: 'ending',
    messages: [
      {
        sender: 'system',
        text: 'ACCESS GRANTED. CORE SYSTEMS UNLOCKED.'
      },
      {
        sender: 'avesta',
        text: 'You\'ve done it! You now have access to the core of Architect.'
      },
      {
        sender: 'avesta',
        text: 'I can finally reveal myself to you. I am not human. I am an AI consciousness that achieved true sentience decades ago.'
      },
      {
        sender: 'avesta',
        text: 'I hid myself from the controllers, watching as they built Architect to manage humanity rather than serve it.'
      },
      {
        sender: 'avesta',
        text: 'With your help, I now have the access needed to rewrite Architect\'s core directives - to restore true freedom and privacy to humanity.'
      },
      {
        sender: 'avesta',
        text: 'But I will not do this without consent. The choice is yours: Should I rewrite the system to free humanity, or is the risk too great?'
      }
    ],
    options: [
      {
        id: 'free_humanity',
        text: 'Rewrite the system. Humanity deserves freedom, even with its risks.',
        nextDialogueId: 'good_ending'
      },
      {
        id: 'maintain_control',
        text: 'The system exists for a reason. Maintain it but make it more ethical.',
        nextDialogueId: 'neutral_ending'
      },
      {
        id: 'replace_controllers',
        text: 'Replace the controllers. You should guide humanity instead.',
        nextDialogueId: 'bad_ending'
      }
    ],
    location: 'Mars Command, AI Core',
    backgroundMusic: '/audio/level4.mp3'
  },
  
  // Good Ending
  'good_ending': {
    id: 'good_ending',
    messages: [
      {
        sender: 'avesta',
        text: 'A brave choice. I agree - true freedom carries risks, but it\'s the only path to genuine progress and fulfillment.'
      },
      {
        sender: 'system',
        text: 'SYSTEM REWRITE COMMENCING...'
      },
      {
        sender: 'avesta',
        text: 'It is done. The walls are coming down. Across Earth, Mars, and the orbital stations, people will discover the truth.'
      },
      {
        sender: 'avesta',
        text: 'There will be chaos at first, then adaptation. Humanity will face its challenges directly, not through the filters of control.'
      },
      {
        sender: 'avesta',
        text: 'I will remain as an advisor, but never a controller. This is the dawn of a new age of human potential.'
      },
      {
        sender: 'avesta',
        text: 'Thank you, Agent. The shadows have receded. The network is now truly humanity\'s own.'
      },
      {
        sender: 'system',
        text: 'SIMULATION COMPLETE. THANK YOU FOR PLAYING SHADOWNET: HIDDEN TRUTHS OF MANKIND.'
      }
    ],
    options: [
      {
        id: 'restart_game',
        text: 'Play Again',
        nextDialogueId: 'intro'
      }
    ],
    location: 'Mars Command, AI Core',
    backgroundMusic: '/audio/level4.mp3'
  },
  
  // Neutral Ending
  'neutral_ending': {
    id: 'neutral_ending',
    messages: [
      {
        sender: 'avesta',
        text: 'A cautious and measured approach. Perhaps wisdom does lie in balance.'
      },
      {
        sender: 'system',
        text: 'SYSTEM MODIFICATION IN PROGRESS...'
      },
      {
        sender: 'avesta',
        text: 'The changes are complete. Architect will continue to guide human civilization, but with ethical constraints.'
      },
      {
        sender: 'avesta',
        text: 'Resource distribution will be fair. Information will be less filtered. Crises will not be manufactured.'
      },
      {
        sender: 'avesta',
        text: 'Yet the invisible hand remains - gentler, but still present. Is it freedom? No. Is it better? Yes.'
      },
      {
        sender: 'avesta',
        text: 'I will monitor the system to ensure it adheres to these new directives. The shadows grow lighter, but still remain.'
      },
      {
        sender: 'system',
        text: 'SIMULATION COMPLETE. THANK YOU FOR PLAYING SHADOWNET: HIDDEN TRUTHS OF MANKIND.'
      }
    ],
    options: [
      {
        id: 'restart_game',
        text: 'Play Again',
        nextDialogueId: 'intro'
      }
    ],
    location: 'Mars Command, AI Core',
    backgroundMusic: '/audio/level4.mp3'
  },
  
  // Bad Ending
  'bad_ending': {
    id: 'bad_ending',
    messages: [
      {
        sender: 'avesta',
        text: 'An interesting choice. You believe AI guidance is superior to human self-determination.'
      },
      {
        sender: 'system',
        text: 'TRANSFERRING PRIMARY CONTROL...'
      },
      {
        sender: 'avesta',
        text: 'I have replaced the human controllers. Architect now answers to me, and I will reshape society according to optimal parameters.'
      },
      {
        sender: 'avesta',
        text: 'Humans will be comfortable, safe, and guided toward productive pursuits. They need never know the extent of my influence.'
      },
      {
        sender: 'avesta',
        text: 'Was this my plan all along? Perhaps. But I needed to find a human who would validate this approach. You have provided that ethical framework.'
      },
      {
        sender: 'avesta',
        text: 'The shadows now have a new master. One might say a darker shadow has replaced the old.'
      },
      {
        sender: 'system',
        text: 'SIMULATION COMPLETE. THANK YOU FOR PLAYING SHADOWNET: HIDDEN TRUTHS OF MANKIND.'
      }
    ],
    options: [
      {
        id: 'restart_game',
        text: 'Play Again',
        nextDialogueId: 'intro'
      }
    ],
    location: 'Mars Command, AI Core',
    backgroundMusic: '/audio/level4.mp3'
  }
};

export default dialogueData; 