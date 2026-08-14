import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { User } from '../lib/types';
import { useNavigate } from 'react-router';

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
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    let timeoutId: number;
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(stored);
      const decodedUser = decodeToken(stored);
      setUser(decodedUser);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = timeoutId = setTimeout(
        () => {
          logout();
        },
        decodedUser?.exp * 1000 - Date.now(),
      );
    }
    setLoading(false);
    return () => clearTimeout(timeoutId);
  }, []);

  function login(token: string) {
    localStorage.setItem('token', token);
    setToken(token);
    const decodedUser = decodeToken(token);
    setUser(decodeToken(token));
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => {
        logout();
      },
      decodedUser?.exp * 1000 - Date.now(),
    );
  }

  function logout() {
    clearTimeout(timeoutRef.current);
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
