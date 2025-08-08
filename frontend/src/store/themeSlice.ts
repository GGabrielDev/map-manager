import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { ThemeMode } from '@/theme';
import { getCachedThemeMode, setCachedThemeMode } from '@/theme';

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: getCachedThemeMode(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      setCachedThemeMode(state.mode);
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      setCachedThemeMode(state.mode);
    },
  },
});

export const { toggleTheme, setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
