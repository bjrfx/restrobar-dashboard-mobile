import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LabelBottomNavigation from './Components/BottomNavigation/BottomNavigation';
import Home from './Pages/Home/Home';
import Reservation from './Pages/Reservation/Reservation';
import Subscription from './Pages/Subscription/Subscription';
import Archive from './Pages/Archive/Archive';
import Settings from './Pages/Setings/Settings';
import InstallPrompt from './Components/InstallPrompt';
import Signin from './Pages/signin/Signin';
import Signup from './Pages/signup/Signup';
import { AuthProvider } from './Components/Auth/AuthContext';
import PrivateRoute from './Components/Auth/PrivateRoute';
import ForgotPassword from './Pages/PasswordReset/ForgotPassword';
import RequestNotificationPermission from './Components/NotificationPermission/RequestNotificationPermission';
import { AnimatePresence, motion } from 'framer-motion';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [transitionsEnabled, setTransitionsEnabled] = useState(true);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      alert("This application is only compatible with mobile devices.");
      navigate('/');
    }
  }, [navigate]);

  const handleNavigation = (path) => {
    const paths = ['/', '/reservation', '/subscription', '/archive', '/settings'];
    const currentIndex = paths.indexOf(location.pathname);
    const nextIndex = paths.indexOf(path);

    setDirection(nextIndex > currentIndex ? 1 : -1);
    navigate(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <RequestNotificationPermission />
      <CssBaseline />
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ flex: 1, paddingBottom: '56px' }}>
            {transitionsEnabled ? (
              <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      <motion.div
                        initial={{ x: direction === 1 ? 1000 : -1000 }}
                        animate={{ x: 0 }}
                        exit={{ x: direction === 1 ? 1000 : -1000 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PrivateRoute>
                          <Home />
                        </PrivateRoute>
                      </motion.div>
                    }
                  />
                  <Route
                    path="/reservation"
                    element={
                      <motion.div
                        initial={{ x: direction === 1 ? -1000 : 1000 }}
                        animate={{ x: 0 }}
                        exit={{ x: direction === 1 ? -1000 : -1000 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PrivateRoute>
                          <Reservation />
                        </PrivateRoute>
                      </motion.div>
                    }
                  />
                  <Route
                    path="/subscription"
                    element={
                      <motion.div
                        initial={{ x: direction === 1 ? -1000 : 1000 }}
                        animate={{ x: 0 }}
                        exit={{ x: direction === 1 ? 1000 : -1000 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PrivateRoute>
                          <Subscription />
                        </PrivateRoute>
                      </motion.div>
                    }
                  />
                  <Route
                    path="/archive"
                    element={
                      <motion.div
                        initial={{ x: direction === 1 ? -1000 : 1000 }}
                        animate={{ x: 0 }}
                        exit={{ x: direction === 1 ? 1000 : -1000 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PrivateRoute>
                          <Archive />
                        </PrivateRoute>
                      </motion.div>
                    }
                  />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/settings"
                    element={
                      <motion.div
                        initial={{ x: direction === 1 ? -1000 : 1000 }}
                        animate={{ x: 0 }}
                        exit={{ x: direction === 1 ? 1000 : -1000 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Settings
                          setDarkMode={setDarkMode}
                          darkMode={darkMode}
                          transitionsEnabled={transitionsEnabled}
                          setTransitionsEnabled={setTransitionsEnabled}
                        />
                      </motion.div>
                    }
                  />
                </Routes>
              </AnimatePresence>
            ) : (
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/reservation" element={<PrivateRoute><Reservation /></PrivateRoute>} />
                <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
                <Route path="/archive" element={<PrivateRoute><Archive /></PrivateRoute>} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      setDarkMode={setDarkMode}
                      darkMode={darkMode}
                      transitionsEnabled={transitionsEnabled}
                      setTransitionsEnabled={setTransitionsEnabled}
                    />
                  }
                />
              </Routes>
            )}
          </div>
          <InstallPrompt />
        </div>
        <LabelBottomNavigation 
          onNavigate={handleNavigation} 
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} 
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;