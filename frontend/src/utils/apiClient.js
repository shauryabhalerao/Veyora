const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Centralized API Client for Veyora frontend application.
 * Manages headers, JWT tokens, 401 token expiration, 403 authorization failures,
 * 500 server errors, and network connectivity failures.
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('veyora_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Parse JSON safely
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Handle Session Expiration / Invalid Token
        localStorage.removeItem('veyora_token');
        localStorage.removeItem('veyora_user');

        // Notify AuthContext & global listeners
        window.dispatchEvent(new CustomEvent('veyora-auth-unauthorized', {
          detail: { message: data?.message || 'Your session has expired. Please log in again.' }
        }));

        const err = new Error(data?.message || 'Your session has expired. Please log in again.');
        err.status = 401;
        throw err;
      }

      if (response.status === 403) {
        // Authorization Failure (Role/Permission) - DO NOT wipe login session
        const err = new Error(data?.message || 'Access denied. You do not have permission to access this resource.');
        err.status = 403;
        throw err;
      }

      if (response.status >= 500) {
        const err = new Error(data?.message || data?.error || 'A server error occurred. Please try again later.');
        err.status = response.status;
        throw err;
      }

      const err = new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
      err.status = response.status;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Network failure (Backend down / unavailable)
      window.dispatchEvent(new CustomEvent('veyora-backend-unavailable', {
        detail: { message: 'Unable to connect to the Veyora server. Please try again.' }
      }));
      const netErr = new Error('Unable to connect to the Veyora server. Please try again.');
      netErr.isNetworkError = true;
      throw netErr;
    }

    throw error;
  }
};
