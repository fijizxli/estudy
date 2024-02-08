import {createContext, useContext, useState, ReactNode} from "react";

interface User {
    username: string | null;
    auth: string | null;
    id: number | null;
    isLoggedIn: boolean | null;
}

interface AuthContextProps {
    user: User | null;
    authModalType: string | null;
    setModalType: (modalType: string) => void;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authModalType, setAuthModalType] = useState<string | null>(null);

  const setModalType = (modalType: string) => {
    setAuthModalType(modalType);
  };

  const login = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authModalType, setModalType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};