import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton, Box, Card, CardContent, Typography, Grid, IconButton, TextField, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const [showArrow, setShowArrow] = useState(false); // State for showing the scroll-to-top button
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const theme = useTheme(); // Get the current theme

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appnTHlJCaYJJOfhN/tblLpBnM72RerRDjY', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        const data = response.data.records.map(record => ({
          id: record.id,
          email: record.fields['Email'], // Assuming 'Email' is the field name
        }));

        setSubscriptions(data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ padding: 2, paddingBottom: 70 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Subscription List
      </Typography>
      <hr />

      {/* Search Field */}
      <TextField
        label="Search by Email"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        // Show skeleton loader while loading
        <Grid container spacing={2} justifyContent="center">
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Render actual content once data is loaded
        <Grid container spacing={2} justifyContent="center">
          {filteredSubscriptions.map((subscription) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={subscription.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Email: {subscription.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Scroll-to-top button */}
      {showArrow && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 80, // Adjust this value if needed
            right: 20,
            backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#000', // Circle color based on mode
            color: theme.palette.mode === 'dark' ? '#000' : '#fff', // Arrow color based on mode
            borderRadius: '50%',
            padding: '10px',
            boxShadow: 3,
            zIndex: 9999, // Ensure the button is above other elements like bottom navigation
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#ddd' : '#444',
            },
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default Subscription;
