import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authApi } from '@/services/api';
import type { RootState } from '@/store/index';
import type { AuthState, LoginCredentials, User } from '@/types/auth';

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
      const response = await authApi.login(credentials);
      return response.token;
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed');
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
      if (!token) {
        return rejectWithValue('No token available');
      }

      const user = await authApi.me(token);
      return user;
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
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

      // Validate with backend using the API service
      const response = await authApi.validate(token);
      return response.valid;
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
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
