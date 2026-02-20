import React, { useState, createContext } from 'react';
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { yellow, red, blue } from '@material-ui/core/colors';

const ThemeStateContext = createContext();

const glassValues = {
  dark: {
    background: 'rgba(66, 66, 66, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    hoverBorder: '1px solid rgba(255, 255, 255, 0.15)',
    hoverShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  },
  light: {
    background: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    hoverBorder: '1px solid rgba(0, 0, 0, 0.12)',
    hoverShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  },
};

function ThemeStateProvider({ children }) {
  const [themeState, setThemeState] = useState(() => {
    const localTheme = localStorage.getItem('themeState');
    if (localTheme !== null) {
      return localTheme.match(/^dark$/i) ? 'dark' : 'light';
    } else {
      localStorage.setItem('themeState', 'dark');
      return 'dark';
    }
  }); // handleThemeChange in src/screens/main/Settings.jsx lines 87-99;

  const palletType = themeState === 'dark' ? 'dark' : 'light';
  const themeTextColor = themeState === 'dark' ? '#fff' : '#000';
  const isDark = themeState === 'dark';

  const mainPrimaryColor = isDark ? yellow[700] : blue[600];
  const mainSecondaryColor = isDark ? '#ff8f00' : red[600];
  const bgColor = isDark ? '#424242' : '#FAFAFA';
  const glass = isDark ? glassValues.dark : glassValues.light;

  const handleTheme = createMuiTheme({
    palette: {
      background: {
        paper: bgColor,
        default: bgColor,
      },
      type: palletType,
      text: {
        primary: themeTextColor,
      },
      input: {
        '&::placeholder': {
          primary: themeTextColor,
        },
        primary: themeTextColor,
      },
      typography: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
      },
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
    shape: {
      borderRadius: 12,
    },
    custom: {
      glass,
    },
    props: {
      MuiTextField: {
        variant: 'outlined',
        size: 'small',
      },
    },
    overrides: {
      MuiCard: {
        root: {
          background: glass.background,
          backdropFilter: glass.backdropFilter,
          WebkitBackdropFilter: glass.backdropFilter,
          border: glass.border,
          boxShadow: glass.boxShadow,
        },
      },
      MuiButton: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          transition: 'all 0.2s ease',
        },
      },
      MuiAccordion: {
        root: {
          background: glass.background,
          backdropFilter: glass.backdropFilter,
          WebkitBackdropFilter: glass.backdropFilter,
          border: glass.border,
          boxShadow: glass.boxShadow,
          borderRadius: '12px !important',
          '&:before': {
            display: 'none',
          },
        },
      },
      MuiDialog: {
        paper: {
          background: isDark ? 'rgba(66, 66, 66, 0.3)' : 'rgba(250, 250, 250, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: glass.border,
          boxShadow: isDark
            ? '-40px 40px 80px -8px rgba(0, 0, 0, 0.24)'
            : '-40px 40px 80px -8px rgba(0, 0, 0, 0.08)',
          borderRadius: 24,
        },
      },
      MuiDialogTitle: {
        root: {
          padding: '24px',
        },
      },
      MuiDialogContent: {
        root: {
          padding: '0 24px',
        },
        dividers: {
          borderTop: 0,
          borderBottomStyle: 'dashed',
          borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
      },
      MuiDialogActions: {
        root: {
          padding: '16px 24px',
        },
      },
      MuiBackdrop: {
        root: {
          backgroundColor: isDark ? 'rgba(66, 66, 66, 0.3)' : 'rgba(250, 250, 250, 0.3)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        },
      },
      MuiOutlinedInput: {
        root: {
          borderRadius: 8,
          backgroundColor: isDark ? 'rgba(217,217,217,0.05)' : 'rgba(0,0,0,0.04)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        },
        notchedOutline: {
          borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)',
          transition: 'border-color 0.2s ease',
        },
      },
      MuiFilledInput: {
        root: {
          borderRadius: 8,
          backgroundColor: isDark ? 'rgba(217,217,217,0.05)' : 'rgba(0,0,0,0.04)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(217,217,217,0.08)' : 'rgba(0,0,0,0.06)',
          },
          '&.Mui-focused': {
            backgroundColor: isDark ? 'rgba(217,217,217,0.08)' : 'rgba(0,0,0,0.06)',
          },
        },
      },
      MuiInputLabel: {
        root: {
          fontWeight: 600,
          fontSize: '0.85rem',
        },
      },
      MuiNativeSelect: {
        root: {
          borderRadius: 8,
        },
      },
    },
  });

  return (
    <ThemeProvider theme={handleTheme}>
      <SCThemeProvider theme={handleTheme}>
        <ThemeStateContext.Provider value={[themeState, setThemeState]}>
          {children}
        </ThemeStateContext.Provider>
      </SCThemeProvider>
    </ThemeProvider>
  );
}

export { ThemeStateContext, ThemeStateProvider };
