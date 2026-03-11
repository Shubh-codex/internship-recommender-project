import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  FilterList as FilterIcon 
} from '@mui/icons-material';

const skillOptions = [
  'python', 'javascript', 'java', 'react', 'nodejs', 'ml', 'keras', 
  'tensorflow', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes'
];

const sectorOptions = [
  'Software Development', 'AI/ML', 'AI', 'Data Science', 'Web Development',
  'Mobile Development', 'DevOps', 'Cybersecurity', 'UI/UX Design'
];

const locationOptions = [
  'Delhi', 'Bangalore', 'Mumbai', 'Hyderabad', 'Chennai', 
  'Pune', 'Kolkata', 'Remote', 'Gurgaon', 'Noida'
];

function SearchForm({ onSearch, loading = false }) {
  const [filters, setFilters] = useState({
    skills: '',
    sector: '',
    location: '',
    duration: '',
    fresherFriendly: ''
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      skills: '',
      sector: '',
      location: '',
      duration: '',
      fresherFriendly: ''
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Skills</InputLabel>
            <Select
              value={filters.skills}
              label="Skills"
              onChange={(e) => handleInputChange('skills', e.target.value)}
            >
              <MenuItem value="">All Skills</MenuItem>
              {skillOptions.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sector</InputLabel>
            <Select
              value={filters.sector}
              label="Sector"
              onChange={(e) => handleInputChange('sector', e.target.value)}
            >
              <MenuItem value="">All Sectors</MenuItem>
              {sectorOptions.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={filters.location}
              label="Location"
              onChange={(e) => handleInputChange('location', e.target.value)}
            >
              <MenuItem value="">All Locations</MenuItem>
              {locationOptions.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Fresher Friendly</InputLabel>
            <Select
              value={filters.fresherFriendly}
              label="Fresher Friendly"
              onChange={(e) => handleInputChange('fresherFriendly', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={<SearchIcon />}
              fullWidth
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(filters).map(([key, value]) => 
            value ? (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                onDelete={() => handleInputChange(key, '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : null
          )}
        </Box>
      )}
    </Paper>
  );
}

export default SearchForm;
