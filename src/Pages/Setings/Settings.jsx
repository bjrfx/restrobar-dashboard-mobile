import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography, Box, Button, CircularProgress, Card, CardContent, Divider, Avatar, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Settings = ({ darkMode, setDarkMode }) => {
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/settings'); // Navigate to settings page
      window.location.reload(); // Reload the page to clear session-specific data
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto', position: 'relative' }}>
      {/* Conditionally render Logout or Login button */}
      {auth.currentUser ? (
        <Button
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
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
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
          onClick={() => navigate('/signin')}
        >
          Signin
        </Button>
      )}

      {/* Profile Image at the Top Left */}
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

      {/* User Info Section */}
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

      {/* Dark Mode Switch */}
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Theme Settings
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleThemeChange} />}
            label="Dark Mode"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
