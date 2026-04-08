import { createContext, useState, useEffect, type ReactNode } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  contactNumber?: string;
  address?: string;
  faculty?: string;
  semester?: string;
  year?: string;
  points?: number;
  rank?: string;
  badges?: string[];
  firstLogin?: string | Date;
  lastLogin?: string | Date;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};