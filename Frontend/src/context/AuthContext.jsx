import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setLoading(false);
        return;
    }

    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(loginTime);
      const oneHour = 60 * 60 * 1000; 

      if (timeElapsed >= oneHour) {
        handleAutoLogout();
        return;
      }

      // Set timer for remaining time
      const remainingTime = oneHour - timeElapsed;
      setTimeout(() => {
        handleAutoLogout();
      }, remainingTime);
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLogout = () => {
      authService.logout();
      localStorage.removeItem('loginTime');
      setUser(null);
      setLoading(false);
      toast.error("Your login timeout is up and login again");
  };

  const login = async (userData) => {
    try {
      const data = await authService.login(userData);
      setUser(data.user);
      localStorage.setItem('loginTime', Date.now().toString());
      
      // Set timer for 1 hour
      setTimeout(() => {
          handleAutoLogout();
      }, 60 * 60 * 1000);

      toast.success('Login Successfully');
      return data;
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      toast.success('Registration success! Please login.');
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Registration failed');
        throw error;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('loginTime');
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
