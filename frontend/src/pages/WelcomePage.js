import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fade,
  useTheme,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp,
  People,
  Star,
  ArrowForward,
  Work,
  School,
  LocationOn
} from '@mui/icons-material';

const features = [
  {
    icon: <SearchIcon />,
    title: 'Smart Search',
    description: 'Find internships that perfectly match your skills and interests with advanced filters.'
  },
  {
    icon: <TrendingUp />,
    title: 'Career Growth',
    description: 'Discover the best opportunities to boost your career and gain valuable experience.'
  },
  {
    icon: <People />,
    title: 'Top Companies',
    description: 'Connect with industry-leading companies hiring interns across India.'
  },
  {
    icon: <Star />,
    title: 'Personalized',
    description: 'Get internship recommendations tailored to your goals and profile.'
  }
];

const stats = [
  { number: '10K+', label: 'Active Internships', icon: <Work /> },
  { number: '500+', label: 'Partner Companies', icon: <People /> },
  { number: '50K+', label: 'Success Stories', icon: <School /> },
  { number: '100+', label: 'Cities', icon: <LocationOn /> }
];

function WelcomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/internships');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Fade in timeout={1000}>
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 5, md: 8 },
            px: { xs: 2, md: 6 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
            borderRadius: 4,
            mb: 8,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Find Your Perfect Internship
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}
          >
            Discover amazing internship opportunities from top companies across India.
            Start building your career today with AI/ML, Software Development, Data Analytics, and more.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={handleGetStarted}
            sx={{
              py: 1.5,
              px: 5,
              fontSize: '1.1rem',
              borderRadius: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: '#fff',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: '0.3s ease-in-out'
              }
            }}
          >
            Explore Internships
          </Button>
        </Box>
      </Fade>

      {/* Stats Section */}
      <Fade in timeout={1200}>
        <Grid container spacing={3} sx={{ mb: 10 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 3,
                  px: 1,
                  borderRadius: 3,
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  transition: 'transform 0.25s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fade>

      {/* Features Section */}
      <Fade in timeout={1400}>
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
            Why Choose InternshipHub?
          </Typography>
          <Divider
            sx={{
              width: 80,
              height: 4,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              mx: 'auto',
              mb: 4,
            }}
          />
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    background: `linear-gradient(135deg, #fff, #f9f9f9)`,
                    borderRadius: 3,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                    transition: 'all 0.25s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        width: 65,
                        height: 65,
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" gutterBottom fontWeight="600">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* CTA Section */}
      <Fade in timeout={1600}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Start Your Journey?
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{ opacity: 0.9, mb: 3 }}
          >
            Join thousands of students who found their perfect internships through InternshipHub.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: '#fff',
              color: theme.palette.primary.main,
              py: 1.5,
              px: 5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: '#f5f5f5',
                transform: 'scale(1.05)',
                transition: '0.3s ease-in-out'
              }
            }}
          >
            Start Searching Now
          </Button>
        </Box>
      </Fade>
    </Container>
  );
}

export default WelcomePage;
