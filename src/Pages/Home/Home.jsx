import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Container,
  AppBar,
  Toolbar,
  Skeleton,
} from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import moment from "moment";
import logo from "../../logo.png";
import UserInfo from "../../Components/UserInfo/UserInfo";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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

const fetchAllRecords = async (baseUrl, headers) => {
  let allRecords = [];
  let offset = null;

  do {
    try {
      const response = await axios.get(baseUrl + (offset ? `&offset=${offset}` : ""), {
        headers,
      });
      allRecords = [...allRecords, ...response.data.records];
      offset = response.data.offset || null;
    } catch (error) {
      console.error("Error fetching records:", error);
      break;
    }
  } while (offset);

  return allRecords;
};

const createDynamicDescription = (totalReservations, activeReservations) => {
  return `Total Reservations: ${totalReservations}, Active Reservations: ${activeReservations}`;
};

const Home = () => {
  const userData = UserInfo();
  const [totalReservations, setTotalReservations] = useState(0);
  const [activeReservations, setActiveReservations] = useState(0);
  const [totalArchives, setTotalArchives] = useState(0);
  const [archiveMonthlyData, setArchiveMonthlyData] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [loading, setLoading] = useState(true);  // Added loading state

  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const lineChartVisible = useObserveVisibility(lineChartRef);
  const barChartVisible = useObserveVisibility(barChartRef);
  const pieChartVisible = useObserveVisibility(pieChartRef);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationBaseUrl =
          "https://api.airtable.com/v0/appcRUV4NMy7IsDFI/tblqkjaFo2onOs9Tm?view=Grid%20view";
        const archiveBaseUrl =
          "https://api.airtable.com/v0/appR9pTEld4i3NTFJ/tblm0Bfb2n9HlvjdJ?view=Grid%20view";
        const headers = {
          Authorization: `Bearer patCivRJrJBScuORc.8bd709c0d76ff06234939d1fad4f2008148d0846fdb72523613b5394381dd21e`,
        };

        // Fetch all reservation records
        const reservationRecords = await fetchAllRecords(reservationBaseUrl, headers);

        const total = reservationRecords.length;
        const active = reservationRecords.filter((record) =>
          moment(record.fields["Start Date"]).isSameOrAfter(moment(), "day")
        ).length;

        setTotalReservations(total);
        setActiveReservations(active);

        // Fetch all archive records
        const archiveRecords = await fetchAllRecords(archiveBaseUrl, headers);

        const totalArchive = archiveRecords.length;
        setTotalArchives(totalArchive);

        const monthlyData = Array(30).fill(0);
        archiveRecords.forEach((record) => {
          const dayDiff = moment().diff(moment(record.fields["Start Date"]), "days");
          if (dayDiff < 30) monthlyData[29 - dayDiff] += 1;
        });
        setArchiveMonthlyData(monthlyData);

        // Set loading to false once data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);  // Set loading to false even if error occurs
      }
    };

    fetchData();
  }, []);

  const lineData = {
    labels: Array.from({ length: 7 }, (_, i) => moment().subtract(i, "days").format("ddd")).reverse(),
    datasets: [
      {
        label: "Reservations (Past 7 Days)",
        data: [5, 8, 10, 4, 9, 7, 6],
        borderColor: "rgba(75,192,192,1)",
        fill: true,
      },
    ],
  };

  const barData = {
    labels: Array.from({ length: 30 }, (_, i) =>
      moment().subtract(i, "days").format("MMM D")
    ).reverse(),
    datasets: [
      {
        label: "Archives (Past 30 Days)",
        data: archiveMonthlyData,
        backgroundColor: "rgba(153,102,255,0.5)",
      },
    ],
  };

  const pieData = {
    labels: ["Total Reservations", "Active Reservations", "Archives"],
    datasets: [
      {
        data: [totalReservations, activeReservations, totalArchives],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <AppBar position="sticky" sx={{ margin: 0, top: 0, left: 0, right: 0, boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 40 }} />
          <Typography variant="p" sx={{ marginLeft: "auto" }}>
            {/* {userData?.name ? `${userData.name}'s Dashboard` : "Dashboard"} */}
            {loading ? <Skeleton width="200px" /> : userData?.name ? `${userData.name}'s Dashboard` : "Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Box sx={{ textAlign: "center", marginBottom: 4, marginTop: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {loading ? <Skeleton width="200px" /> : userData?.name ? `Welcome back, ${userData.name}` : "Welcome back!"}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {loading ? <Skeleton width="250px" /> : "Check Reservation & Archive Summary"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {loading ? <Skeleton width="300px" /> : createDynamicDescription(totalReservations, activeReservations)}
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Total Reservations</Typography>
                {loading ? <Skeleton variant="text" width="80%" /> : <Typography variant="h4" align="center">{totalReservations}</Typography>}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Active Reservations</Typography>
                {loading ? <Skeleton variant="text" width="80%" /> : <Typography variant="h4" align="center">{activeReservations}</Typography>}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Total Archives</Typography>
                {loading ? <Skeleton variant="text" width="80%" /> : <Typography variant="h4" align="center">{totalArchives}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 6 }} ref={pieChartRef}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Reservation & Archive Summary</Typography>
            {pieChartVisible && <Pie data={pieData} />}
          </Card>
        </Box>

        <Box sx={{ marginTop: 6 }} ref={lineChartRef}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Reservations (Last 7 Days)</Typography>
            {lineChartVisible && <Line data={lineData} />}
          </Card>
        </Box>

        <Box sx={{ marginTop: 6 }} ref={barChartRef}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Archives (Last 30 Days)</Typography>
            {barChartVisible && <Bar data={barData} />}
          </Card>
        </Box>
      </Container>

      {showScrollToTop && (
        <IconButton
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            backgroundColor: "#3f51b5",
            color: "white",
          }}
          onClick={() => window.scrollTo(0, 0)}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default Home;