import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import mapReducer from './slices/mapSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    map: mapReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
