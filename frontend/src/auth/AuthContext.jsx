import React, { createContext, useContext, useState, useEffect } from 'react';
import * as auth from '../api/auth';
import { fetchTasks } from '../api/task';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchTasks()
      .then(() => {
        const email = localStorage.getItem('user_email') || 'usuário';
        setUser({ email });
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await auth.login(email, password);
    const { access_token, token_type } = data;

    localStorage.setItem('token', access_token);
    localStorage.setItem('token_type', token_type);
    localStorage.setItem('user_email', email);
    setUser({ email });
  };

  const register = async (name, email, password, password_confirmation) => {
    const data = await auth.register(name, email, password, password_confirmation);
    const { access_token, token_type } = data;

    localStorage.setItem('token', access_token);
    localStorage.setItem('token_type', token_type);
    localStorage.setItem('user_email', email);
    setUser({ email });
  };

  const guestLogin = async () => {
    const data = await auth.guestLogin(); 

    const { token, token_type, user } = data;

    localStorage.setItem('token', token);
    localStorage.setItem('token_type', token_type || 'Bearer');
    localStorage.setItem('user_email', user.email);
    setUser({ email: user.email });
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user_email');
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      guestLogin, // ← exporta aqui
      logout,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
