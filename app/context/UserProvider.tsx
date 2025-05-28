'use client';

import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface User {
  id: string;
  username: string;
  email: string | null;
  password: string;
  score: number;
  karma: number;
  choices: string;
  flagsCaptured: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
});

export const useUser = () => {
  return useContext(UserContext);
};

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
} 