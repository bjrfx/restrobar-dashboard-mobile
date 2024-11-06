import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton, Box, Card, CardContent, Typography, Grid, TextField, IconButton, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import moment from 'moment';

const Archive = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showArrow, setShowArrow] = useState(false); // Scroll to top button visibility
  const theme = useTheme(); // Get the current theme

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appR9pTEld4i3NTFJ/tblm0Bfb2n9HlvjdJ?view=Grid%20view', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        const data = response.data.records.map(record => ({
          id: record.id,
          name: record.fields['Name'],
          phoneNumber: record.fields['Phone Number'],
          startDate: record.fields['Start Date'],
        }));

        setRecords(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Handle search query change
  useEffect(() => {
    setFilteredRecords(
      records.filter(record =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, records]);

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
        Archive
      </Typography>
      <hr />

      {/* Search bar */}
      <TextField
        fullWidth
        label="Search by Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        // Skeleton loader
        <Grid container spacing={2} justifyContent="center">
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} width="80%" />
                  <Skeleton variant="text" height={40} width="60%" />
                  <Skeleton variant="text" height={40} width="70%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Render the filtered records once the data is loaded
        <Grid container spacing={2} justifyContent="center">
          {filteredRecords.map((record) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={record.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Name: {record.name}</Typography>
                  <Typography variant="body1">Phone Number: {record.phoneNumber}</Typography>
                  <Typography variant="body2">Start Date: {moment(record.startDate).format('MMMM Do YYYY')}</Typography>
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

export default Archive;
