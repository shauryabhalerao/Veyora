import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('veyora_token') || null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  // Clear authentication state and local storage credentials
  const clearAuthState = useCallback(() => {
    localStorage.removeItem('veyora_token');
    localStorage.removeItem('veyora_user');
    setToken(null);
    setUser(null);
  }, []);

  // Initialize and verify authentication on app load
  const initializeAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('veyora_token');

    // Rule: veyora_token is the ONLY valid auth credential.
    // If veyora_token does not exist, user is NOT authenticated.
    if (!savedToken) {
      clearAuthState();
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient('/auth/me', { method: 'GET' });

      if (data && data.success && data.user) {
        setUser(data.user);
        setToken(savedToken);
        localStorage.setItem('veyora_user', JSON.stringify(data.user));
        setServerError(null);
      } else {
        clearAuthState();
      }
    } catch (error) {
      if (error.isNetworkError) {
        setServerError('Unable to connect to the Veyora server. Please try again.');
      } else if (error.status === 401 || error.status === 403) {
        clearAuthState();
        setServerError('Your session has expired. Please log in again.');
      } else {
        clearAuthState();
      }
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  useEffect(() => {
    initializeAuth();

    // Global listener for 401 Unauthorized events from apiClient
    const handleUnauthorized = (e) => {
      clearAuthState();
      setServerError(e.detail?.message || 'Your session has expired. Please log in again.');
    };

    // Global listener for backend network failure
    const handleBackendUnavailable = (e) => {
      setServerError(e.detail?.message || 'Unable to connect to the Veyora server. Please try again.');
    };

    window.addEventListener('veyora-auth-unauthorized', handleUnauthorized);
    window.addEventListener('veyora-backend-unavailable', handleBackendUnavailable);

    return () => {
      window.removeEventListener('veyora-auth-unauthorized', handleUnauthorized);
      window.removeEventListener('veyora-backend-unavailable', handleBackendUnavailable);
    };
  }, [initializeAuth, clearAuthState]);

  const login = async (email, password) => {
    try {
      setServerError(null);
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (!data || !data.success || !data.token) {
        throw new Error(data?.message || 'Login failed. Please check your credentials.');
      }

      const { token: newToken, user: newUser } = data;
      localStorage.setItem('veyora_token', newToken);
      localStorage.setItem('veyora_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      setServerError(null);

      return { success: true, user: newUser };
    } catch (error) {
      if (error.isNetworkError) {
        setServerError('Unable to connect to the Veyora server. Please try again.');
      }
      throw error;
    }
  };

  const signup = async (signupData) => {
    try {
      setServerError(null);
      const data = await apiClient('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData)
      });

      if (!data || !data.success || !data.token) {
        throw new Error(data?.message || 'Signup failed. Please check your details.');
      }

      const { token: newToken, user: newUser } = data;
      localStorage.setItem('veyora_token', newToken);
      localStorage.setItem('veyora_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      setServerError(null);

      return { success: true, user: newUser };
    } catch (error) {
      if (error.isNetworkError) {
        setServerError('Unable to connect to the Veyora server. Please try again.');
      }
      throw error;
    }
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem('veyora_token');
    if (!currentToken) {
      clearAuthState();
      return null;
    }

    try {
      const data = await apiClient('/auth/me', { method: 'GET' });
      if (data && data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('veyora_user', JSON.stringify(data.user));
        return data.user;
      } else {
        clearAuthState();
        return null;
      }
    } catch (error) {
      if (error.status === 401) {
        clearAuthState();
      }
      return null;
    }
  };

  const logout = () => {
    const currentToken = token || localStorage.getItem('veyora_token');
    if (currentToken) {
      apiClient('/auth/logout', { method: 'POST' }).catch(() => {});
    }

    clearAuthState();
    setServerError(null);
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('veyora_user', JSON.stringify(updated));
      return updated;
    });
  };

  const clearServerError = () => setServerError(null);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      serverError,
      clearServerError,
      login,
      signup,
      logout,
      refreshUser,
      updateUserProfile,
      retryAuthInit: initializeAuth,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
