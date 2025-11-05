import React, { createContext, ReactNode, useContext, useState } from "react";

type User = {
  name: string;
  email: string;
  phone: string;
  image?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
