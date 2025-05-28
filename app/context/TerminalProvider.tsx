'use client';

import { createContext, useContext, useState } from 'react';

interface TerminalContextType {
  terminalOutput: string[];
  setTerminalOutput: (output: string[]) => void;
  addTerminalOutput: (line: string) => void;
  clearTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType>({
  terminalOutput: [],
  setTerminalOutput: () => {},
  addTerminalOutput: () => {},
  clearTerminal: () => {}
});

export const useTerminal = () => {
  return useContext(TerminalContext);
};

export default function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const addTerminalOutput = (line: string) => {
    setTerminalOutput(prev => [...prev, line]);
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  return (
    <TerminalContext.Provider value={{ 
      terminalOutput, 
      setTerminalOutput, 
      addTerminalOutput,
      clearTerminal 
    }}>
      {children}
    </TerminalContext.Provider>
  );
} 