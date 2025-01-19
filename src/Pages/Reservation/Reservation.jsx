import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Skeleton,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  TextField,
  useTheme,
  ButtonBase,
} from '@mui/material';
import moment from 'moment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const [visibleCards, setVisibleCards] = useState({});

  useEffect(() => {
    const fetchReservations = async () => {
      let allRecords = [];
      let offset = null;

      try {
        do {
          const response = await axios.get(
            'https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm?view=Grid%20view',
            {
              headers: {
                Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
              },
              params: {
                offset: offset, // Pass the offset for pagination
              },
            }
          );

          const { records, offset: nextOffset } = response.data;

          // Add fetched records to allRecords
          allRecords = [
            ...allRecords,
            ...records.map((record) => ({
              id: record.id,
              name: record.fields['Name'],
              phone: record.fields['Phone Number'],
              startDate: record.fields['Start Date'],
              startTime: record.fields['Start Time'],
              persons: record.fields['Persons'],
            })),
          ];

          offset = nextOffset; // Update offset for the next request
        } while (offset); // Continue until offset is null

        setReservations(allRecords); // Set all records to state
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter((record) => {
    const recordName = record.name?.toLowerCase() || ''; // Use an empty string if name is undefined
    const recordPhone = record.phone || ''; // Use an empty string if phone is undefined
  
    return (
      moment(record.startDate).isSameOrAfter(moment(), 'day') &&
      (recordName.includes(searchTerm.toLowerCase()) || recordPhone.includes(searchTerm))
    );
  });

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

  // Observer for fade-in and fade-out animation
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisibleCards((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the card is visible
      }
    );

    // Observe each reservation card
    document.querySelectorAll('.reservation-card').forEach((card) => {
      observer.current.observe(card);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [filteredReservations]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Reservation List
      </Typography>
      <hr />

      <TextField
        label="Search by Name or Phone"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      {/* I need a turn on switch or a button here. when i turn on this i want edit and delete buttons should be enabled.*/}
      {loading ? (
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
        <Grid container spacing={2} justifyContent="center">
          {filteredReservations.map((reservation) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={reservation.id}>
              <ButtonBase focusRipple sx={{ width: '100%', display: 'block' }}>
                <Card
                  id={reservation.id}
                  className="reservation-card"
                  sx={{
                    opacity: visibleCards[reservation.id] ? 1 : 0,
                    transform: visibleCards[reservation.id]
                      ? 'translateY(0)'
                      : 'translateY(20px)',
                    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
                  }}
                >
                  {/* when clicked on delete my card should delete from database. And if clicked on edit i should be able to edit and when i click on tickmark button the data should change also in database.  */}
                  {/* These ButtonBase for delete and edit css are not perfect, please write a better related code, i need these buttons on right end side of the */}
                  <CardContent sx={{ textAlign: 'left' }}>
                    <Typography variant="h6">{reservation.name}</Typography>
                    <Typography variant="body2">
                      Phone: {reservation.phone}
                    </Typography>
                    <Typography variant="body2">
                      Date: {moment(reservation.startDate).format('MMM Do YYYY')}
                    </Typography>
                    <Typography variant="body2">
                      Time: {reservation.startTime}
                    </Typography>
                    <Typography variant="body2">
                      Persons: {reservation.persons}
                    </Typography>
                  </CardContent>
                </Card>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      )}

      {showArrow && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            backgroundColor:
              theme.palette.mode === 'dark' ? '#fff' : '#000',
            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
            borderRadius: '50%',
            padding: '10px',
            boxShadow: 3,
            zIndex: 9999,
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'dark' ? '#ddd' : '#444',
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