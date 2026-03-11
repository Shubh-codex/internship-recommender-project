import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip
} from '@mui/material';
import SearchForm from '../components/SearchForm';
import InternshipCard from '../components/InternshipCard';

const API_BASE_URL = 'http://localhost:8080/api/internships';

function InternshipPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch all internships on component mount
  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = API_BASE_URL;
      const params = new URLSearchParams();
      
      // Build query parameters based on filters
      if (filters.skills) {
        url += '/search';
        params.append('skills', filters.skills);
      }
      if (filters.sector) {
        params.append('sector', filters.sector);
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.fresherFriendly) {
        params.append('fresherFriendly', filters.fresherFriendly);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInternships(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError('Failed to fetch internships. Please try again later.');
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    fetchInternships(filters);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    // Sort the current internships array
    const sorted = [...internships].sort((a, b) => {
      switch (event.target.value) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'sector':
          return a.sector.localeCompare(b.sector);
        default:
          return b.id - a.id; // newest first
      }
    });
    setInternships(sorted);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Find Internships
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Discover amazing internship opportunities tailored to your skills and preferences
      </Typography>

      {/* Search Form */}
      <SearchForm onSearch={handleSearch} loading={loading} />

      {/* Results Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">
            {loading ? 'Searching...' : `${internships.length} internships found`}
          </Typography>
        </Box>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={handleSortChange}
            disabled={loading}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="location">Location</MenuItem>
            <MenuItem value="duration">Duration</MenuItem>
            <MenuItem value="sector">Sector</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} />
        </Box>
      )}

      {/* No Results */}
      {!loading && !error && internships.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No internships found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search filters or check back later for new opportunities.
          </Typography>
        </Paper>
      )}

      {/* Results Grid */}
      {!loading && !error && internships.length > 0 && (
        <Grid container spacing={3}>
          {internships.map((internship) => (
            <Grid item xs={12} sm={6} lg={4} key={internship.id}>
              <InternshipCard internship={internship} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Popular Skills Section */}
      {!loading && internships.length > 0 && (
        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Popular Skills in Current Results
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[...new Set(
              internships
                .flatMap(internship => 
                  internship.requiredSkills ? internship.requiredSkills.split(',') : []
                )
                .map(skill => skill.trim())
            )].slice(0, 10).map((skill, index) => (
              <Chip 
                key={index}
                label={skill}
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleSearch({ skills: skill })}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default InternshipPage;