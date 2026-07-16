import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token: token, refresh_token, user: userData } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refresh_token);
    setUser(userData);
    return userData;
  };

  const demoLogin = async () => {
    const response = await api.post('/auth/demo');
    const { access_token: token, refresh_token, user: userData } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refresh_token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { access_token: token, refresh_token, user: userData } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refresh_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
