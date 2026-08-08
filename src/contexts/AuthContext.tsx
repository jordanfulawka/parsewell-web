import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../lib/types';

interface AuthContextProps {
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(stored);
      setUser(decodeToken(stored));
    }
    setLoading(false);
  }, []);

  function login(token: string) {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(decodeToken(token));
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ login, logout, token, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('You can only use useAuth from within the AuthContext');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
