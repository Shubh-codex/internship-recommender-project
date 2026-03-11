import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Schedule,
  Business,
  Share,
  Visibility,
  PersonOutline
} from '@mui/icons-material';

function InternshipCard({ internship }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [open, setOpen] = useState(false);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: internship.title,
        text: `Check out this internship: ${internship.title}`,
        url: window.location.href
      });
    }
  };

  const handleViewDetails = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const skillsArray = internship.requiredSkills ? internship.requiredSkills.split(',') : [];

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              {internship.title}
            </Typography>
            <Box>
              <Tooltip title="Share">
                <IconButton size="small" onClick={handleShare}>
                  <Share fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <IconButton 
                  size="small" 
                  onClick={handleToggleFavorite}
                  color={isFavorite ? "error" : "default"}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
            {internship.sector}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <Chip 
              icon={<LocationOn />} 
              label={internship.location} 
              size="small" 
              variant="outlined"
              color="primary"
            />
            <Chip 
              icon={<Schedule />} 
              label={internship.duration} 
              size="small" 
              variant="outlined"
              color="secondary"
            />
            <Chip 
              icon={<PersonOutline />} 
              label={internship.fresherFriendly === 'Yes' ? 'Fresher Friendly' : 'Experience Required'} 
              size="small" 
              variant="outlined"
              color={internship.fresherFriendly === 'Yes' ? 'success' : 'warning'}
            />
          </Box>

          {skillsArray.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Required Skills:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {skillsArray.slice(0, 4).map((skill, index) => (
                  <Chip 
                    key={index}
                    label={skill.trim()}
                    size="small" 
                    color="default"
                    variant="filled"
                  />
                ))}
                {skillsArray.length > 4 && (
                  <Chip 
                    label={`+${skillsArray.length - 4} more`}
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<Visibility />}
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </CardActions>
      </Card>

      {/* Detail Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div">
            {internship.title}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            {internship.sector}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body1" paragraph>
                  📍 {internship.location}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Duration
                </Typography>
                <Typography variant="body1" paragraph>
                  ⏰ {internship.duration}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Fresher Friendly
                </Typography>
                <Typography variant="body1" paragraph>
                  {internship.fresherFriendly === 'Yes' ? '✅ Yes' : '❌ Experience Required'}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Internship ID
                </Typography>
                <Typography variant="body1" paragraph>
                  #{internship.id}
                </Typography>
              </Grid>
            </Grid>
            
            {skillsArray.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Required Skills
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {skillsArray.map((skill, index) => (
                    <Chip 
                      key={index}
                      label={skill.trim()}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" color="primary">
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default InternshipCard;