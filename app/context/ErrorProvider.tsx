'use client';

import { createContext, useContext, useState } from 'react';

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {}
});

export const useError = () => {
  return useContext(ErrorContext);
};

export default function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
} 