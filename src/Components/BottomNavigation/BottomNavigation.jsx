import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleClick = (to) => {
    navigate(to);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        handleClick('/');
        break;
      case 1:
        handleClick('/reservation');
        break;
      case 2:
        handleClick('/subscription');
        break;
      case 3:
        handleClick('/archive');
        break;
      case 4:
        handleClick('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <BottomNavigation
      sx={{ width: '100%', position: 'fixed', bottom: 0, bgcolor: 'background.paper' }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Reservation" icon={<BookIcon />} />
      <BottomNavigationAction label="Subscription" icon={<SubscriptionsIcon />} />
      <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
      <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
    </BottomNavigation>
  );
}