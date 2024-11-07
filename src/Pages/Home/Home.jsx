import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, IconButton, Container, AppBar, Toolbar } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import moment from 'moment';
import logo from '../../logo.png';
import UserInfo from '../../Components/UserInfo/UserInfo';
import ModalTemplate from '../../Components/Modal/ModalTemplate';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const useObserveVisibility = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};

const Home = () => {
  const userData = UserInfo();
  const [totalReservations, setTotalReservations] = useState(0);
  const [activeReservations, setActiveReservations] = useState(0);
  const [totalArchives, setTotalArchives] = useState(0);
  const [averagePartySize, setAveragePartySize] = useState(0);
  const [archiveMonthlyData, setArchiveMonthlyData] = useState([]);
  const [dynamicDescription, setDynamicDescription] = useState("");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const [animatedTotalReservations, setAnimatedTotalReservations] = useState(0);
  const [animatedActiveReservations, setAnimatedActiveReservations] = useState(0);
  const [animatedTotalArchives, setAnimatedTotalArchives] = useState(0);

  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const lineChartVisible = useObserveVisibility(lineChartRef);
  const barChartVisible = useObserveVisibility(barChartRef);
  const pieChartVisible = useObserveVisibility(pieChartRef);

  const createDynamicDescription = (total, active, totalPersons, times) => {
    const mostPopularTime = Object.keys(times).reduce((a, b) => (times[a] > times[b] ? a : b), null);
    const avgPartySize = (totalPersons / total).toFixed(1);
    const monthReservations = times[mostPopularTime] || 0;

    const timeDescription = mostPopularTime && monthReservations
      ? ` Most customers prefer booking in the ${mostPopularTime} hours, making up about ${monthReservations} reservations this month.`
      : "";

    return `Currently, there are ${active} active reservations out of a total of ${total}, with approximately ${avgPartySize} persons per reservation.` + timeDescription;
  };

  const animateNumber = (targetValue, setState) => {
    let startValue = 0;
    const step = Math.ceil(targetValue / 50);
    const interval = setInterval(() => {
      startValue += step;
      if (startValue >= targetValue) {
        startValue = targetValue;
        clearInterval(interval);
      }
      setState(startValue);
    }, 20);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationResponse = await axios.get('https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm?view=Grid%20view', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        const archiveResponse = await axios.get('https://api.airtable.com/v0/appR9pTEld4i3NTFJ/tblm0Bfb2n9HlvjdJ?view=Grid%20view', {
          headers: {
            Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
          },
        });

        const reservationData = reservationResponse.data.records.map(record => ({
          id: record.id,
          startDate: record.fields['Start Date'],
          persons: record.fields['Persons']
        }));

        const total = reservationData.length;
        const active = reservationData.filter(record => moment(record.startDate).isSameOrAfter(moment(), 'day')).length;
        let totalPersons = 0;
        const times = { morning: 0, afternoon: 0, evening: 0, night: 0 };

        reservationData.forEach(record => {
          totalPersons += record.persons || 1;
          const hour = moment(record.startDate).hour();
          if (hour >= 6 && hour < 12) times.morning += 1;
          else if (hour >= 12 && hour < 17) times.afternoon += 1;
          else if (hour >= 17 && hour < 21) times.evening += 1;
          else times.night += 1;
        });

        setTotalReservations(total);
        setActiveReservations(active);
        setAveragePartySize(totalPersons / total);
        const description = createDynamicDescription(total, active, totalPersons, times);
        setDynamicDescription(description);
        setFadeIn(true);
        animateNumber(total, setAnimatedTotalReservations);
        animateNumber(active, setAnimatedActiveReservations);

        const archiveData = archiveResponse.data.records.map(record => ({
          id: record.id,
          startDate: record.fields['Start Date'],
        }));

        const totalArchive = archiveData.length;
        setTotalArchives(totalArchive);
        animateNumber(totalArchive, setAnimatedTotalArchives);

        const monthlyData = Array(30).fill(0);
        archiveData.forEach(record => {
          const dayDiff = moment().diff(moment(record.startDate), 'days');
          if (dayDiff < 30) monthlyData[29 - dayDiff] += 1;
        });
        setArchiveMonthlyData(monthlyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const lineData = {
    labels: Array.from({ length: 7 }, (_, i) => moment().subtract(i, 'days').format('ddd')).reverse(),
    datasets: [
      {
        label: 'Reservations (Past 7 Days)',
        data: [5, 8, 10, 4, 9, 7, 6],
        borderColor: 'rgba(75,192,192,1)',
        fill: true,
      },
    ],
  };

  const barData = {
    labels: Array.from({ length: 30 }, (_, i) => moment().subtract(i, 'days').format('MMM D')).reverse(),
    datasets: [
      {
        label: 'Archives (Past 30 Days)',
        data: archiveMonthlyData,
        backgroundColor: 'rgba(153,102,255,0.5)',
      },
    ],
  };

  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <AppBar position="sticky" sx={{ margin: 0, top: 0, left: 0, right: 0, boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 40 }} />
          <Typography variant="p" sx={{ marginLeft: 'auto' }}>
            {userData?.name ? `${userData.name}'s Dashboard` : "Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Modal commented because it's not responsive; solve later */}
      {/* <ModalTemplate
        title={
          <Typography variant="h5" sx={{ textAlign: 'center', marginY: 4 }}>
            {userData?.name ? `Welcome back, ${userData.name}!` : "Welcome to your dashboard!"}
          </Typography>
        }
        content={
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', marginY: 2 }}>
            {userData?.name
              ? `It's great to see you again, ${userData.name}. Here you can manage your reservations, check recent activities, and keep an eye on your records. Let's make today productive!`
              : `Here you can manage your reservations, check recent activities, and keep track of all your records. Let’s get started!`}
          </Typography>
        }
      /> */}
      {/* Modal end */}

      <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 4, marginTop: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Welcome back, {userData?.name || "User"}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Checkout Reservation & Archive Summary
          </Typography>
          <Typography
            variant="p"
            sx={{
              marginTop: 2,
              marginBottom: 4,
              opacity: fadeIn ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 200,
            }}
          >
            {dynamicDescription}
          </Typography>
          <hr style={{ width: '50%', margin: 'auto' }} />
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Total Reservations</Typography>
                <Typography variant="h4" align="center">{animatedTotalReservations}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Active Reservations</Typography>
                <Typography variant="h4" align="center">{animatedActiveReservations}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Total Archives</Typography>
                <Typography variant="h4" align="center">{animatedTotalArchives}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 6 }} ref={lineChartRef}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Reservations Over the Past 7 Days</Typography>
            {lineChartVisible && <Line data={lineData} />}
          </Card>
        </Box>

        <Box sx={{ marginTop: 6 }} ref={barChartRef}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Archives Over the Past 30 Days</Typography>
            {barChartVisible && <Bar data={barData} />}
          </Card>
        </Box>

        <Box sx={{ marginTop: 6 }} ref={pieChartRef}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Reservations by Time of Day</Typography>
            {pieChartVisible && <Pie data={{ labels: ['Morning', 'Afternoon', 'Evening', 'Night'], datasets: [{ data: [4, 5, 7, 2], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] }} />}
          </Card>
        </Box>

        {showScrollToTop && (
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
              position: 'fixed',
              bottom: 90,
              right: 30,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        )}
      </Container>
    </Box>
  );
};

export default Home;