import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton, Box, Card, CardContent, Typography, Grid, IconButton, TextField, useTheme } from '@mui/material';
import moment from 'moment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const [showArrow, setShowArrow] = useState(false); // State for showing the scroll-to-top button
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [lastReservationId, setLastReservationId] = useState(null); // To track the last reservation ID for notifications
  const theme = useTheme(); // Get the current theme

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm?view=Grid%20view', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        console.log('Airtable Response:', response.data); // Log the response to debug

        const data = response.data.records.map(record => ({
          id: record.id,
          name: record.fields['Name'],
          phone: record.fields['Phone Number'],
          startDate: record.fields['Start Date'],
          startTime: record.fields['Start Time'],
          persons: record.fields['Persons'],
        }));

        console.log('Mapped Reservations:', data); // Log the mapped data

        // Check if a new reservation is added (based on the latest reservation ID)
        if (data.length && data[0].id !== lastReservationId) {
          // Send a notification if a new reservation is found
          if (Notification.permission === 'granted') {
            new Notification('New Reservation', {
              body: `New reservation by ${data[0].name}`,
            });
          }
          // Update reservations state and the last reservation ID
          setReservations(data);
          setLastReservationId(data[0].id);
        } else {
          setReservations(data); // No new reservations, just update data
        }

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching reservation data:', error);
        setLoading(false); // Stop loading in case of error
      }
    };

    // Fetch reservations initially
    fetchReservations();

    // Poll for new reservations every 30 seconds
    const interval = setInterval(fetchReservations, 30000); // 30 seconds interval

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [lastReservationId]); // Re-fetch reservations when the lastReservationId changes

  const filteredReservations = reservations.filter(record =>
    moment(record.startDate).isSameOrAfter(moment(), 'day') &&
    (record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.phone.includes(searchTerm))
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
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reservation List
      </Typography>
      <hr />

      {/* Search Field */}
      <TextField
        label="Search by Name or Phone"
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
                  <Skeleton variant="text" height={40} width="60%" />
                  <Skeleton variant="text" height={40} width="80%" />
                  <Skeleton variant="text" height={40} width="50%" />
                  <Skeleton variant="text" height={40} width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Render actual content once data is loaded
        <Grid container spacing={2} justifyContent="center">
          {filteredReservations.map((reservation) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={reservation.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{reservation.name}</Typography>
                  <Typography variant="body2">Phone: {reservation.phone}</Typography>
                  <Typography variant="body2">Date: {moment(reservation.startDate).format('MMM Do YYYY')}</Typography>
                  <Typography variant="body2">Time: {reservation.startTime}</Typography>
                  <Typography variant="body2">Persons: {reservation.persons}</Typography>
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

export default Reservation;
