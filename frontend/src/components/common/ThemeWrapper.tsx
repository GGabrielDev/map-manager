import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {useSelector} from 'react-redux';

import type { RootState } from '@/store';
import { createAppTheme } from '@/styles/material-ui-theme';


export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const themeMode = useSelector((state: RootState) => state.ui.mode);
  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
