'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from './context/UserProvider';
import { ErrorProvider } from './context/ErrorProvider';
import { TerminalProvider } from './context/TerminalProvider';
import { LanguageProvider } from './contexts/LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <UserProvider>
          <ErrorProvider>
            <TerminalProvider>
              {children}
            </TerminalProvider>
          </ErrorProvider>
        </UserProvider>
      </LanguageProvider>
    </SessionProvider>
  );
} 