'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TerminalContextType {
  terminalOutput: string[];
  setTerminalOutput: (output: string[]) => void;
  terminalHistory: string[];
  setTerminalHistory: (history: string[]) => void;
  terminalInput: string;
  setTerminalInput: (input: string) => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState<string>('');

  return (
    <TerminalContext.Provider 
      value={{ 
        terminalOutput, 
        setTerminalOutput,
        terminalHistory,
        setTerminalHistory,
        terminalInput,
        setTerminalInput
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
} 