import { Colors } from './Colors';

// Soft color palette inspired by nature and modern design
const palette = {
  sage: {
    50: '#F8FAF8',
    100: '#F2F5F3',
    200: '#E5EBE7',
    300: '#D1DDD5',
    400: '#B3C7B9',
    500: '#94B09D',
    600: '#759A80',
    700: '#5C7B65',
    800: '#445C4B',
    900: '#2C3D32',
  },
  mint: {
    50: '#F0F9F6',
    100: '#E1F4ED',
    200: '#C3E9DB',
    300: '#A5DEC9',
    400: '#87D3B7',
    500: '#69C8A5',
    600: '#54A084',
    700: '#3F7863',
    800: '#2A5042',
    900: '#152821',
  },
  clay: {
    50: '#FDFCFB',
    100: '#F9F7F4',
    200: '#F3EFE9',
    300: '#E7DFD3',
    400: '#DBCFBD',
    500: '#CFBFA7',
    600: '#C3AF91',
    700: '#9C8C74',
    800: '#756957',
    900: '#4E463A',
  },
  error: {
    light: '#FDE8E8',
    main: '#F44336',
    dark: '#C62828',
  },
  warning: {
    light: '#FFF3E0',
    main: '#FF9800',
    dark: '#EF6C00',
  },
  success: {
    light: '#E8F5E9',
    main: '#4CAF50',
    dark: '#2E7D32',
  },
  info: {
    light: '#E3F2FD',
    main: '#2196F3',
    dark: '#1565C0',
  },
};

export const Theme = {
  colors: {
    ...Colors,
    // Primary brand colors
    primary: palette.sage[600],
    primaryLight: palette.sage[300],
    primaryDark: palette.sage[700],
    
    // Secondary accent colors
    secondary: palette.mint[500],
    secondaryLight: palette.mint[300],
    secondaryDark: palette.mint[700],
    
    // Neutral/background colors
    background: {
      light: palette.sage[50],
      dark: palette.sage[100],
    },
    surface: {
      light: '#FFFFFF',
      dark: palette.sage[50],
    },
    card: {
      light: '#FFFFFF',
      dark: palette.sage[50],
    },
    
    // Text colors
    text: {
      primary: {
        light: palette.sage[900],
        dark: palette.sage[800],
      },
      secondary: {
        light: palette.sage[700],
        dark: palette.sage[600],
      },
      disabled: {
        light: palette.sage[400],
        dark: palette.sage[500],
      },
    },
    
    // Border colors
    border: {
      light: palette.sage[200],
      dark: palette.sage[300],
    },
    
    // Status colors
    error: palette.error.main,
    warning: palette.warning.main,
    success: palette.success.main,
    info: palette.info.main,
    
    // Status background colors
    statusBackground: {
      error: palette.error.light,
      warning: palette.warning.light,
      success: palette.success.light,
      info: palette.info.light,
    },
  },
  
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 40,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
      xxxl: 40,
      display: 48,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
    },
  },
  
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  
  shadows: {
    light: {
      sm: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    dark: {
      sm: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        elevation: 4,
      },
    },
  },
  
  // Animation durations
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Layout constants
  layout: {
    maxWidth: 428, // Max width for mobile
    contentPadding: 16,
    headerHeight: 56,
    bottomTabHeight: 56,
    bottomSheetHandleHeight: 24,
  },
}; 