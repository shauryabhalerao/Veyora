import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('veyora_user');
    return saved ? JSON.parse(saved) : {
      name: 'Eleanor Vance',
      email: 'eleanor@veyora.com',
      phone: '+91 98765 43210',
      role: 'admin', // defaulted to admin so user can explore admin dashboard easily!
      loyaltyPoints: 350,
      referralCode: 'VEYORA-ELEANOR-98',
      savedAddresses: [
        {
          id: 'addr-1',
          name: 'Eleanor Vance',
          street: '42 Marine Drive, Apt 7B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400020',
          phone: '+91 98765 43210',
          isDefault: true
        }
      ],
      sizeProfile: {
        Women: { topSize: 'M', bottomSize: '28', bust: '36', waist: '28', hip: '38' },
        Men: { shirtSize: 'L', trouserSize: '32', chest: '40' },
        Kids: { ageGroup: '6-7Y' }
      }
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('veyora_token') || 'demo_jwt_token_secret');

  useEffect(() => {
    if (user) {
      localStorage.setItem('veyora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('veyora_user');
    }
  }, [user]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken || 'demo_jwt_token_secret');
    localStorage.setItem('veyora_token', jwtToken || 'demo_jwt_token_secret');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('veyora_token');
    localStorage.removeItem('veyora_user');
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  const addAddress = (newAddress) => {
    setUser(prev => ({
      ...prev,
      savedAddresses: [...(prev.savedAddresses || []), { ...newAddress, id: `addr-${Date.now()}` }]
    }));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserProfile, addAddress, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
