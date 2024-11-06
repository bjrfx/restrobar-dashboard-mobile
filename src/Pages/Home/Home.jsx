import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import moment from 'moment';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; // For the Scroll to Top Icon
import logo from '../../logo.png'
const Home = () => {
  const [totalReservations, setTotalReservations] = useState(0);
  const [oldReservations, setOldReservations] = useState(0);
  const [activeReservations, setActiveReservations] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalArchives, setTotalArchives] = useState(0); // New state for Archive data

  const [totalAnim, setTotalAnim] = useState(0);
  const [oldAnim, setOldAnim] = useState(0);
  const [activeAnim, setActiveAnim] = useState(0);
  const [subscriptionAnim, setSubscriptionAnim] = useState(0);
  const [archiveAnim, setArchiveAnim] = useState(0); // New state for Archive animation

  const [showScrollToTop, setShowScrollToTop] = useState(false); // State to control button visibility

  useEffect(() => {
    // Fetch reservation data
    const fetchReservations = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm?view=Grid%20view', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        const data = response.data.records.map(record => ({
          id: record.id,
          startDate: record.fields['Start Date'],
        }));

        // Calculate counts
        const total = data.length;
        const old = data.filter(record => moment(record.startDate).isBefore(moment(), 'day')).length;
        const active = data.filter(record => moment(record.startDate).isSameOrAfter(moment(), 'day')).length;

        setTotalReservations(total);
        setOldReservations(old);
        setActiveReservations(active);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    };

    // Fetch subscription data
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appnTHlJCaYJJOfhN/tblLpBnM72RerRDjY', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        const subscriptions = response.data.records;
        setTotalSubscriptions(subscriptions.length);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    // Fetch archive data
    const fetchArchives = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appR9pTEld4i3NTFJ/tblm0Bfb2n9HlvjdJ?view=Grid%20view', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        const archives = response.data.records;
        setTotalArchives(archives.length);
      } catch (error) {
        console.error('Error fetching archive data:', error);
      }
    };

    fetchReservations();
    fetchSubscriptions();
    fetchArchives(); // Fetch archive data
  }, []);

  // Function to simulate the typewriter animation for numbers
  const animateNumber = (targetValue, setState) => {
    let startValue = 0;
    const step = Math.ceil(targetValue / 100); // Increment by a small step
    const interval = setInterval(() => {
      startValue += step;
      if (startValue >= targetValue) {
        startValue = targetValue; // Set the final value
        clearInterval(interval); // Stop the interval
      }
      setState(startValue);
    }, 20); // Update the state every 20ms
  };

  useEffect(() => {
    animateNumber(totalReservations, setTotalAnim);
    animateNumber(oldReservations, setOldAnim);
    animateNumber(activeReservations, setActiveAnim);
    animateNumber(totalSubscriptions, setSubscriptionAnim);
    animateNumber(totalArchives, setArchiveAnim); // Animate archive count
  }, [totalReservations, oldReservations, activeReservations, totalSubscriptions, totalArchives]);

  // Handle Scroll Position
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box sx={{ padding: 2, paddingBottom: 70 }}> {/* Added bottom padding to avoid overlap with navigation */}
    <img src={logo} alt="logo" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', marginTop: '10px', marginBottom: '10px' }} />
      <Typography variant="h4" align="center" gutterBottom>
        Reservation Summary
      </Typography>
      <hr />

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Total Reservations
              </Typography>
              <Typography variant="h4" align="center">
                {totalAnim}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Old Reservations
              </Typography>
              <Typography variant="h4" align="center">
                {oldAnim}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Active Reservations
              </Typography>
              <Typography variant="h4" align="center">
                {activeAnim}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
        Email Subscription Summary
      </Typography>
      <hr />

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Total Subscriptions
              </Typography>
              <Typography variant="h4" align="center">
                {subscriptionAnim}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
        Archive Summary
      </Typography>
      <hr />

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" align="center">
                Total Archives
              </Typography>
              <Typography variant="h4" align="center">
                {archiveAnim}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <IconButton
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 90, // Adjust this value to make sure it's above the bottom navigation
          right: 30,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        <KeyboardArrowUpIcon />
      </IconButton>      
      )}
    </Box>
  );
};

export default Home;
