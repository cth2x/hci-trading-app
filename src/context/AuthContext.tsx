import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';

// Define the initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Define action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

// Create the reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// Create the context
interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    twoFactorCode: string
  ) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = async (
    email: string,
    password: string,
    twoFactorCode: string
  ) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      // In a real app, this would be an API call
      // For this mockup, we'll simulate a successful login
      if (!email || !password || !twoFactorCode) {
        throw new Error('All fields are required');
      }

      if (twoFactorCode !== '123456') {
        throw new Error('Invalid two-factor authentication code');
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        balance: 10000,
        portfolioValue: 0,
      };

      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'REGISTER_REQUEST' });

    try {
      // In a real app, this would be an API call
      // For this mockup, we'll simulate a successful registration
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: '1',
        name,
        email,
        balance: 10000,
        portfolioValue: 0,
      };

      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
