import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice.ts';
import themeReducer from './themeSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
