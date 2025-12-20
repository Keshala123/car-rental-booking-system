/**
 * useAuth Hook
 * Custom hook to access authentication context
 * Separated from AuthContext for Fast Refresh compatibility
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextDefinition';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
