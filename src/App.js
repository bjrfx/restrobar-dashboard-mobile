import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LabelBottomNavigation from './Components/BottomNavigation/BottomNavigation';
import Home from './Pages/Home/Home';
import Reservation from './Pages/Reservation/Reservation';
import Subscription from './Pages/Subscription/Subscription';
import Archive from './Pages/Archive/Archive';
import Settings from './Pages/Setings/Settings';
import InstallPrompt from './Components/InstallPrompt'; // Import the InstallPrompt component
import Signin from './Pages/signin/Signin';
import Signup from './Pages/signup/Signup';
import {AuthProvider} from './Components/Auth/AuthContext'
import PrivateRoute from './Components/Auth/PrivateRoute';
import { Navigate } from 'react-router-dom';
import ForgotPassword from './Pages/PasswordReset/ForgotPassword';

const App = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  // Set up MUI theme with dark/light mode support
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // Device restriction effect
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      alert("This application is only compatible with mobile devices.");
      navigate('/'); 
    }
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
      <Routes>
      <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/reservation" element={<PrivateRoute><Reservation /></PrivateRoute>} />
        <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
        <Route path="/archive" element={<PrivateRoute><Archive /></PrivateRoute>} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path="/settings" element={<Settings setDarkMode={setDarkMode} darkMode={darkMode} />} />
      </Routes>
      </AuthProvider>
      <LabelBottomNavigation />
      <InstallPrompt /> {/* Render the InstallPrompt modal here */}
    </ThemeProvider>
  );
};

export default App;
