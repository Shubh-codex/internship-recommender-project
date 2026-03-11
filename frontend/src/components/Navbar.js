import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Container
} from '@mui/material';
import {
  Home as HomeIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Person as PersonIcon
} from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Internships', path: '/internships', icon: <WorkIcon /> },
    { label: 'Favorites', path: '/favorites', icon: <StarIcon /> },
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> }
  ];

  const handleTabChange = (event, newValue) => {
    navigate(tabs[newValue].path);
  };

  const currentTab = tabs.findIndex(tab => tab.path === location.pathname);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Tabs 
          value={currentTab >= 0 ? currentTab : 0} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          ))}
        </Tabs>
      </Container>
    </Box>
  );
}

export default Navbar;