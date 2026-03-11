import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  LinkedIn,
  Twitter,
  GitHub,
  Email
} from '@mui/icons-material';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              InternshipHub
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              &copy; {currentYear} InternshipHub. Connecting students with amazing internship opportunities.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="inherit" sx={{ opacity: 0.8 }}>
                About Us
              </Link>
              <Link href="/contact" color="inherit" sx={{ opacity: 0.8 }}>
                Contact
              </Link>
              <Link href="/privacy" color="inherit" sx={{ opacity: 0.8 }}>
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" sx={{ opacity: 0.8 }}>
                Terms of Service
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit" sx={{ opacity: 0.8 }}>
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" sx={{ opacity: 0.8 }}>
                <Twitter />
              </IconButton>
              <IconButton color="inherit" sx={{ opacity: 0.8 }}>
                <GitHub />
              </IconButton>
              <IconButton color="inherit" sx={{ opacity: 0.8 }}>
                <Email />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
          Made with ❤️ for students worldwide
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;