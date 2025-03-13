import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TradingPage from './pages/TradingPage';
import PortfolioPage from './pages/PortfolioPage';
import NewsPage from './pages/NewsPage';
import ReportsPage from './pages/ReportsPage';
import HelpPage from './pages/HelpPage';

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e88e5', // Vibrant blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#7c4dff', // Vibrant purple
      light: '#9575cd',
      dark: '#5e35b1',
    },
    background: {
      default: '#f5f7fa', // Light blue-gray background
      paper: '#ffffff', // White for cards
    },
    text: {
      primary: '#2c3e50', // Darker blue-gray for text
      secondary: '#546e7a',
    },
    success: {
      main: '#00c853', // Brighter green for positive trends
      light: '#69f0ae',
      dark: '#00a042',
    },
    error: {
      main: '#ff3d00', // Brighter orange-red for negative trends
      light: '#ff6e40',
      dark: '#dd2c00',
    },
    info: {
      main: '#00b0ff', // Bright blue
      light: '#80d8ff',
      dark: '#0091ea',
    },
    warning: {
      main: '#ffab00', // Bright amber
      light: '#ffd740',
      dark: '#ff8f00',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: 'none',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2c3e50',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(30, 136, 229, 0.12)',
            color: '#1e88e5',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(30, 136, 229, 0.18)',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'rgba(0, 200, 83, 0.12)',
            color: '#00a042',
            borderColor: 'rgba(0, 200, 83, 0.3)',
          },
          '&.MuiChip-colorError': {
            backgroundColor: 'rgba(255, 61, 0, 0.12)',
            color: '#dd2c00',
            borderColor: 'rgba(255, 61, 0, 0.3)',
          },
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(30, 136, 229, 0.12)',
            color: '#1565c0',
            borderColor: 'rgba(30, 136, 229, 0.3)',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(124, 77, 255, 0.12)',
            color: '#5e35b1',
            borderColor: 'rgba(124, 77, 255, 0.3)',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: 'rgba(255, 171, 0, 0.12)',
            color: '#ff8f00',
            borderColor: 'rgba(255, 171, 0, 0.3)',
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: 'rgba(0, 176, 255, 0.12)',
            color: '#0091ea',
            borderColor: 'rgba(0, 176, 255, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(45deg, #5e35b1 30%, #9575cd 90%)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trading"
              element={
                <ProtectedRoute>
                  <TradingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news"
              element={
                <ProtectedRoute>
                  <NewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <HelpPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
