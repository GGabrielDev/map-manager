import { createAsyncThunk,createSlice } from '@reduxjs/toolkit';

import type { AuthState, LoginCredentials,User } from '@/types';

import type { RootState } from '.';

// Token cache key
const TOKEN_CACHE_KEY = 'inventory-app-auth-token';

// Get cached token
const getCachedToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_CACHE_KEY);
  } catch {
    return null;
  }
};

// Cache token
const setCachedToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_CACHE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_CACHE_KEY);
    }
  } catch {
    // Silently fail if localStorage is not available
  }
};

const initialState: AuthState = {
  token: getCachedToken(),
  user: null,
  status: 'idle',
  error: null,
};

// Thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      return data.token;
    } catch (error: Error | unknown) {
      if (error instanceof Error) 
        return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching current user details (permissions, etc.)
export const fetchUser = createAsyncThunk<
  User,
  undefined, // No userId needed anymore
  { state: RootState; rejectValue: string }
  >(
  'auth/fetchUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return data;
    } catch (error: Error | unknown) {
      if (error instanceof Error) 
        return rejectWithValue(error.message);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Thunk for validating current token
export const validateToken = createAsyncThunk<
  boolean,
  undefined,
  { state: RootState; rejectValue: string }
>(
  'auth/validateToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No token available');
      }

      // Check token expiration locally first
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          return rejectWithValue('Token expired');
        }
      } catch {
        return rejectWithValue('Invalid token format');
      }

      // Validate with backend by making a simple authenticated request
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/validate`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue(`Token validation failed: ${response.status}`);
      }

      return true;
    } catch (error: Error | unknown) {
      if (error instanceof Error) 
        return rejectWithValue(error.message);
      return rejectWithValue('Token validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      setCachedToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload;
        setCachedToken(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        // If error indicates token is invalid, clear the token and user data
        const errorMessage = action.payload as string;
        if (errorMessage && (
          errorMessage.includes('Invalid token') || 
          errorMessage.includes('Token') || 
          errorMessage.includes('401') || 
          errorMessage.includes('403') ||
          errorMessage.includes('Unauthorized')
        )) {
          state.token = null;
          state.user = null;
          setCachedToken(null);
        }
      })
      // Handle validateToken
      .addCase(validateToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(validateToken.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        // Token validation failed, clear auth data
        state.token = null;
        state.user = null;
        setCachedToken(null);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
