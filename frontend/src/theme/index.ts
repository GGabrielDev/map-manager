import type { Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

// Theme cache key
const THEME_CACHE_KEY = 'inventory-app-theme-mode';

// Get cached theme mode or default to light
export const getCachedThemeMode = (): ThemeMode => {
  try {
    const cached = localStorage.getItem(THEME_CACHE_KEY);
    return (cached === 'dark' || cached === 'light') ? cached : 'light';
  } catch {
    return 'light';
  }
};

// Cache theme mode
export const setCachedThemeMode = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_CACHE_KEY, mode);
  } catch {
    // Silently fail if localStorage is not available
  }
};

// Create theme based on mode
export const createAppTheme = (mode: ThemeMode): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: { 
        main: mode === 'light' ? '#1976d2' : '#90caf9' 
      },
      secondary: { 
        main: mode === 'light' ? '#dc004e' : '#f48fb1' 
      },
      background: {
        default: mode === 'light' ? '#fafafa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });
};
