import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Skeleton, Box, Card, CardContent, Typography, Grid, TextField, IconButton, useTheme, ButtonBase } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import moment from 'moment';

const Archive = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showArrow, setShowArrow] = useState(false);
  const theme = useTheme();
  const [visibleCards, setVisibleCards] = useState({});

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

  useEffect(() => {
    setFilteredRecords(
      records.filter(record =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, records]);

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

  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setVisibleCards(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      {
        threshold: 0.1,
      }
    );

    document.querySelectorAll('.archive-card').forEach(card => {
      observer.current.observe(card);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [filteredRecords]);

  return (
    <Box sx={{ padding: 2, paddingBottom: 70 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Archive
      </Typography>
      <hr />

      <TextField
        fullWidth
        label="Search by Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
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
        <Grid container spacing={2} justifyContent="center">
          {filteredRecords.map((record) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={record.id}>
              <ButtonBase focusRipple sx={{width: '100%', display: 'block'}}>
              <Card
                id={record.id}
                className="archive-card"
                sx={{
                  opacity: visibleCards[record.id] ? 1 : 0.8,
                  transform: visibleCards[record.id] ? 'translateY(0)' : 'translateY(25px)',
                  transition: 'opacity 0.1s ease-out, transform 0.2s ease-out',
                }}
              >
                <CardContent sx={{textAlign: 'left'}}>
                  <Typography variant="h6">{record.name}</Typography>
                  <Typography variant="body1">Phone Number: {record.phoneNumber}</Typography>
                  <Typography variant="body2">Start Date: {moment(record.startDate).format('MMMM Do YYYY')}</Typography>
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
            backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
            borderRadius: '50%',
            padding: '10px',
            boxShadow: 3,
            zIndex: 9999,
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