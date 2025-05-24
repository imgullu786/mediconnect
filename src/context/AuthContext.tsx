import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Record<string, any>) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...initialState
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // For demo purposes, let's simulate loading a user from local storage
  useEffect(() => {
    const loadUser = () => {
      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        try {
          const userData = JSON.parse(userJSON);
          dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        } catch (err) {
          localStorage.removeItem('user');
        }
      }
    };
    
    loadUser();
  }, []);

  // Mock login - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // This is mock data - in a real app, you'd make an API call
      const mockUser = {
        id: '123',
        email,
        role: email.includes('doctor') ? 'doctor' : 'patient',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          ...(email.includes('doctor') ? {
            specialty: 'Cardiology',
            qualifications: ['MD', 'PhD'],
            experience: 10,
            bio: 'Experienced cardiologist with 10 years of practice.',
            licenseNumber: 'MED12345'
          } : {})
        }
      } as User;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Invalid email or password' 
      });
    }
  };

  // Mock register
  const register = async (userData: Record<string, any>) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '123',
        email: userData.email,
        role: userData.role || 'patient',
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      } as User;
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Registration failed. Please try again.' 
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};