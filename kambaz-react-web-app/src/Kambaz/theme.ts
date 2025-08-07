import { createTheme } from '@mui/material/styles';

// Northwestern University Color Palette
export const northwesternTheme = createTheme({
  palette: {
    primary: {
      main: '#4E2A84', // Northwestern Purple
      light: '#7B5AA6',
      dark: '#342056',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#716C7B', // Northwestern Gray
      light: '#9B9A9E',
      dark: '#4A4A4A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // Completely white background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E2E2E', // Dark gray for primary text
      secondary: '#716C7B', // Northwestern Gray for secondary text
    },
    error: {
      main: '#DC3545',
    },
    warning: {
      main: '#FFC107',
    },
    info: {
      main: '#4E2A84', // Northwestern Purple for info
    },
    success: {
      main: '#28A745',
    },
  },
  typography: {
    fontFamily: '"Akkurat Pro", "Helvetica Neue", Arial, sans-serif', // Northwestern's preferred font
    h1: {
      fontWeight: 600,
      color: '#4E2A84',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      color: '#4E2A84',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      color: '#4E2A84',
    },
    h4: {
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h5: {
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h6: {
      fontWeight: 500,
      color: '#2E2E2E',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4E2A84 0%, #342056 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(78, 42, 132, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7B5AA6 0%, #4E2A84 100%)',
            boxShadow: '0 6px 16px rgba(78, 42, 132, 0.4)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
            boxShadow: '0 2px 8px rgba(78, 42, 132, 0.5)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', // Very light purple background
          color: '#000000', // Black text
          border: '1px solid #C4B5FD', // Light purple border
          boxShadow: '0 3px 10px rgba(78, 42, 132, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
            boxShadow: '0 5px 14px rgba(78, 42, 132, 0.15)',
            transform: 'translateY(-2px)',
            color: '#000000',
          },
        },
        outlinedPrimary: {
          borderColor: '#C4B5FD', // Light purple border
          color: '#000000', // Black text
          borderWidth: '2px',
          '&:hover': {
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)', // Medium purple on hover
            borderColor: '#8B5CF6',
            color: '#FFFFFF', // White text on purple hover background
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(78, 42, 132, 0.2)',
          },
        },
        outlinedSecondary: {
          borderColor: '#C4B5FD', // Light purple border
          color: '#000000',
          borderWidth: '2px',
          '&:hover': {
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
            borderColor: '#8B5CF6',
            color: '#FFFFFF',
            transform: 'translateY(-1px)',
          },
        },
        textPrimary: {
          color: '#4E2A84',
          '&:hover': {
            backgroundColor: 'rgba(78, 42, 132, 0.04)',
            color: '#342056',
          },
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #28A745 0%, #1E7E34 100%)',
          color: '#FFFFFF', // Keep white text on dark green
          boxShadow: '0 3px 10px rgba(40, 167, 69, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #34CE57 0%, #28A745 100%)',
            boxShadow: '0 5px 14px rgba(40, 167, 69, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
        containedWarning: {
          background: 'linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%)', // Light yellow background
          color: '#856404', // Dark text for better contrast
          border: '1px solid #FFC107',
          boxShadow: '0 3px 10px rgba(255, 193, 7, 0.3)',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(135deg, #FFC107 0%, #E0A800 100%)',
            boxShadow: '0 5px 14px rgba(255, 193, 7, 0.4)',
            transform: 'translateY(-2px)',
            color: '#000000', // Black text on darker yellow
          },
        },
        containedError: {
          background: 'linear-gradient(135deg, #DC3545 0%, #B02A37 100%)',
          color: '#FFFFFF', // Keep white text on red
          boxShadow: '0 3px 10px rgba(220, 53, 69, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E45563 0%, #DC3545 100%)',
            boxShadow: '0 5px 14px rgba(220, 53, 69, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        filled: {
          background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', // Very light purple background
          color: '#000000', // Black text
          border: '1px solid #C4B5FD', // Light purple border
          boxShadow: '0 2px 6px rgba(78, 42, 132, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
          },
        },
        outlined: {
          borderColor: '#C4B5FD', // Light purple border
          color: '#000000',
          borderWidth: '1.5px',
          '&:hover': {
            background: 'rgba(245, 243, 255, 0.5)', // Very light purple hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(78, 42, 132, 0.06)', // Very subtle purple shadow
          borderRadius: 8,
          border: '1px solid #F3F4F6', // Very light border
          background: '#FFFFFF', // Pure white background
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #4E2A84 0%, #2D1B69 100%)',
          boxShadow: '0 2px 12px rgba(78, 42, 132, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#4E2A84',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4E2A84',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#4E2A84',
          },
        },
      },
    },
  },
});
