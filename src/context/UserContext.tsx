import React, { createContext, useContext, useState } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
  avatar?: string; // optional profile picture path
};

type UserContextType = {
  user: User | null;
  setUser: (u: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
