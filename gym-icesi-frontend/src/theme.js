import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
    },
    secondary: {
      main: '#4caf50', // Green
    },
    error: {
      main: '#f44336', // Red
    },
    warning: {
      main: '#ff9800', // Orange
    },
    info: {
      main: '#2196f3', // Blue
    },
    success: {
      main: '#4caf50', // Green
    },
    background: {
      default: '#f4f6f8', // Light gray background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#333333', // Dark gray text
      secondary: '#666666', // Medium gray text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none' }, // Disable uppercase for buttons
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded text fields
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded cards/papers
        },
      },
    },
  },
});

export default theme;
