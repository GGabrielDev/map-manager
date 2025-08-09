import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch,RootState } from '@/store';
import { fetchUser, logout } from '@/store/authSlice';

import { AuthContext } from '.';

export { AuthContext } from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user, status, error } = useSelector((state: RootState) => state.auth);

  // On mount (or when token changes), fetch user data if token exists but user is null
  useEffect(() => {
    if (token && !user && status !== 'loading') {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          console.warn('Token expired, logging out');
          dispatch(logout());
          return;
        }
        
        dispatch(fetchUser());
      } catch (err) {
        console.error('Token decoding failure in AuthProvider:', err);
        dispatch(logout());
      }
    }
  }, [token, user, status, dispatch]);

  // Optional: revalidate token periodically (every 5 minutes)
  useEffect(() => {
    if (token && user) {
      const intervalId = setInterval(() => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          // Check if token will expire in the next 2 minutes
          if (payload.exp && payload.exp - currentTime < 120) {
            console.warn('Token expiring soon, logging out');
            dispatch(logout());
            return;
          }
          
          // Optionally re-fetch user data to ensure it's still valid
          dispatch(fetchUser());
        } catch (err) {
          console.error('Token validation error during periodic check:', err);
          dispatch(logout());
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
      
      return () => clearInterval(intervalId);
    }
  }, [token, user, dispatch]);

  // Handle fetchUser rejection to logout on auth errors
  useEffect(() => {
    if (status === 'failed' && error && token) {
      // If we have a token but fetchUser failed, it might be invalid
      if (error.includes('Invalid token') || error.includes('Token') || error.includes('401') || error.includes('403')) {
        console.warn('Authentication failed, logging out:', error);
        dispatch(logout());
      }
    }
  }, [status, error, token, dispatch]);

  // Determine if fetching is in progress
  const loading = status === 'loading' || (!!token && !user && status !== 'failed');

  return (
    <AuthContext.Provider value={{ user, token, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
