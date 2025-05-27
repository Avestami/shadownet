'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface DialogueNode {
  id: string;
  messages: Array<{
    sender: 'system' | 'player' | 'avesta';
    text: string;
    isEncrypted?: boolean;
  }>;
  options?: Array<{
    id: string;
    text: string;
    nextDialogueId?: string;
  }>;
  allowTyping?: boolean;
  backgroundMusic?: string;
  location?: string;
  encryptionChallenge?: {
    type: 'base64' | 'audio' | 'image' | 'cipher';
    solution: string;
    hint: string;
  };
}

interface DialogueContextType {
  currentDialogue: DialogueNode | null;
  dialogueHistory: string[];
  level: number;
  levelComplete: boolean;
  goToDialogue: (dialogueId: string) => void;
  handleOptionSelected: (optionId: string) => void;
  handleMessageSubmit: (message: string) => void;
  completeLevel: () => void;
  resetGame: () => void;
}

// Create context
const DialogueContext = createContext<DialogueContextType | undefined>(undefined);

// Provider component
export function DialogueProvider({ 
  children,
  dialogueData
}: { 
  children: ReactNode;
  dialogueData: Record<string, DialogueNode>;
}) {
  const [currentDialogueId, setCurrentDialogueId] = useState<string>('intro');
  const [dialogueHistory, setDialogueHistory] = useState<string[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);
  
  // Get current dialogue node
  const currentDialogue = dialogueData[currentDialogueId] || null;
  
  // Navigate to a specific dialogue node
  const goToDialogue = (dialogueId: string) => {
    setCurrentDialogueId(dialogueId);
    setDialogueHistory([...dialogueHistory, dialogueId]);
  };
  
  // Handle when player selects an option
  const handleOptionSelected = (optionId: string) => {
    if (!currentDialogue) return;
    
    const selectedOption = currentDialogue.options?.find(option => option.id === optionId);
    
    if (selectedOption?.nextDialogueId) {
      goToDialogue(selectedOption.nextDialogueId);
    }
  };
  
  // Handle when player submits a typed message
  const handleMessageSubmit = (message: string) => {
    // Check for database unlock codes (used in the dev unlocking system)
    const dbUnlockCodes = {
      "start": "level1",
      "follow": "level2", 
      "truth": "level3"
    };
    
    // Check if message matches a database unlock code
    const dbLevel = dbUnlockCodes[message.toLowerCase()];
    if (dbLevel) {
      // If we found a match with database codes and we're in level 1
      if (level === 1 && dbLevel === "level2") {
        setLevelComplete(true);
        return;
      } else if (level === 2 && dbLevel === "level3") {
        setLevelComplete(true);
        return;
      }
    }
    
    // Original encryption challenge logic
    if (!currentDialogue?.encryptionChallenge) return;
    
    // Check if message is solution to encryption challenge
    if (message.toLowerCase() === currentDialogue.encryptionChallenge.solution.toLowerCase()) {
      setLevelComplete(true);
    }
  };
  
  // Complete the current level and move to the next
  const completeLevel = () => {
    setLevel(prevLevel => prevLevel + 1);
    setLevelComplete(false);
    
    // Go to the next level's first dialogue
    const nextLevelStart = `level${level + 1}_start`;
    if (dialogueData[nextLevelStart]) {
      goToDialogue(nextLevelStart);
    } else {
      // If no more levels, go to ending
      goToDialogue('ending');
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setCurrentDialogueId('intro');
    setDialogueHistory([]);
    setLevel(1);
    setLevelComplete(false);
  };
  
  return (
    <DialogueContext.Provider
      value={{
        currentDialogue,
        dialogueHistory,
        level,
        levelComplete,
        goToDialogue,
        handleOptionSelected,
        handleMessageSubmit,
        completeLevel,
        resetGame
      }}
    >
      {children}
    </DialogueContext.Provider>
  );
}

// Custom hook for using the dialogue context
export function useDialogue() {
  const context = useContext(DialogueContext);
  
  if (context === undefined) {
    throw new Error('useDialogue must be used within a DialogueProvider');
  }
  
  return context;
} 