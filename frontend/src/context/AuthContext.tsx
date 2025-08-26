"use client";
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { setAccessToken, getAccessToken } from '@/lib/tokens';
import { http } from '@/lib/http';

type User = { id: string; name: string; email: string; role: string } | null;

type AuthContextType = {
  user: User;
  accessToken: string | null;
  setAccess: (t: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());

  const setAccess = (t: string | null) => {
    setAccessTokenState(t);
    setAccessToken(t);
  };

  const fetchMe = async () => {
    try {
      const res = await http.get('/me');
      setUser(res.data.user);
    } catch (_e) {
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await http.post('/auth/login', { email, password });
    const at = res.headers?.['x-access-token'] as string | undefined;
    if (at) setAccess(at);
    await fetchMe();
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await http.post('/auth/register', { name, email, password });
    const at = res.headers?.['x-access-token'] as string | undefined;
    if (at) setAccess(at);
    await fetchMe();
  };

  const logout = async () => {
    await http.post('/auth/logout');
    setAccess(null);
    setUser(null);
  };

  useEffect(() => {
    // tenta obter perfil se já existir access
    if (accessToken) fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, accessToken, setAccess, login, register, logout, fetchMe }), [user, accessToken]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


