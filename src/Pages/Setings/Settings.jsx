import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography, Box, Button, CircularProgress, Card, CardContent, Divider, Avatar, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Settings = ({ darkMode, setDarkMode, transitionsEnabled, setTransitionsEnabled }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("No user data found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleTransitionToggle = () => {
    setTransitionsEnabled(!transitionsEnabled);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/settings');
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto', position: 'relative' }}>
      {auth.currentUser ? (
        <Button
          variant="contained"
          color="primary"
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={handleLogout}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? "Logging out..." : "Logout"}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => navigate('/signin')}
        >
          Signin
        </Button>
      )}

      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Avatar
          alt="User Profile"
          src={userData?.profilePic || 'https://via.placeholder.com/40'}
          sx={{ width: 40, height: 40 }}
        >
          <img 
            src="https://via.placeholder.com/150/illustrated-user-icon" 
            alt="illustrated user icon" 
            width="40" 
            height="40"
          />
        </Avatar>
      </Box>

      <Card sx={{ marginBottom: 2, marginTop: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          {userData ? (
            <Box>
              <Typography variant="body1"><strong>Name:</strong> {userData.name}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
            </Box>
          ) : (
            <Box>
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="text" width={200} height={30} />
            </Box>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ marginBottom: 2 }} />

      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Theme Settings
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleThemeChange} />}
            label="Dark Mode"
          />
          <FormControlLabel
            control={<Switch checked={transitionsEnabled} onChange={handleTransitionToggle} />}
            label="Page Transitions"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
