import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Skeleton, Box, Card, CardContent, Typography, Grid, IconButton, TextField, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const [visibleCards, setVisibleCards] = useState({});

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
          email: record.fields['Email'],
        }));

        setSubscriptions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Observer for fade-in and fade-out animation
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
      { threshold: 0.1 }
    );

    document.querySelectorAll('.subscription-card').forEach(card => {
      observer.current.observe(card);
    });

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [filteredSubscriptions]);

  return (
    <Box sx={{ padding: 2, paddingBottom: 70 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Subscription List
      </Typography>
      <hr />

      <TextField
        label="Search by Email"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
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
        <Grid container spacing={2} justifyContent="center">
          {filteredSubscriptions.map((subscription) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={subscription.id}>
              <Card
                id={subscription.id}
                className="subscription-card"
                sx={{
                  opacity: visibleCards[subscription.id] ? 1 : 0.5,
                  transform: visibleCards[subscription.id] ? 'translateY(0)' : 'translateY(25px)',
                  transition: 'opacity 0.1s ease-out, transform 0.2s ease-out',
                }}
              >
                <CardContent>
                  <Typography variant="h6">Email: {subscription.email}</Typography>
                </CardContent>
              </Card>
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

export default Subscription;