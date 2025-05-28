'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from './context/UserProvider';
import { ErrorProvider } from './context/ErrorProvider';
import { TerminalProvider } from './context/TerminalProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <ErrorProvider>
          <TerminalProvider>
            {children}
          </TerminalProvider>
        </ErrorProvider>
      </UserProvider>
    </SessionProvider>
  );
} 