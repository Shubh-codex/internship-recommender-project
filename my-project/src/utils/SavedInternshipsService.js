// utils/savedInternshipsService.js

const STORAGE_KEY = 'saved_internships';

export const savedInternshipsService = {
  // Get all saved internships
  getSavedInternships: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading saved internships:', error);
      return [];
    }
  },

  // Save an internship (handles both regular and live internships)
  saveInternship: (internship, type = 'regular') => {
    try {
      const saved = savedInternshipsService.getSavedInternships();
      
      // Create a unique ID based on type and original ID
      const uniqueId = type === 'live' ? `live_${internship.jobId || internship.id}` : `regular_${internship.id}`;
      
      const isAlreadySaved = saved.some(item => item.uniqueId === uniqueId);
      
      if (!isAlreadySaved) {
        // Normalize the internship data structure
        const normalizedInternship = normalizeInternshipData(internship, type);
        const internshipWithMetadata = {
          ...normalizedInternship,
          uniqueId,
          type, // 'regular' or 'live'
          savedAt: new Date().toISOString()
        };
        
        saved.push(internshipWithMetadata);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        return true; // Successfully saved
      }
      return false; // Already saved
    } catch (error) {
      console.error('Error saving internship:', error);
      return false;
    }
  },

  // Remove a saved internship
  removeSavedInternship: (uniqueId) => {
    try {
      const saved = savedInternshipsService.getSavedInternships();
      const filtered = saved.filter(item => item.uniqueId !== uniqueId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing saved internship:', error);
      return false;
    }
  },

  // Check if an internship is saved
  isInternshipSaved: (internship, type = 'regular') => {
    const uniqueId = type === 'live' ? `live_${internship.jobId || internship.id}` : `regular_${internship.id}`;
    const saved = savedInternshipsService.getSavedInternships();
    return saved.some(item => item.uniqueId === uniqueId);
  },

  // Get saved internship IDs only (for performance)
  getSavedInternshipIds: () => {
    const saved = savedInternshipsService.getSavedInternships();
    return new Set(saved.map(item => item.uniqueId));
  },

  // Clear all saved internships
  clearAllSaved: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing saved internships:', error);
      return false;
    }
  },

  // Get saved internships count
  getSavedCount: () => {
    return savedInternshipsService.getSavedInternships().length;
  },

  // Get saved internships by type
  getSavedInternshipsByType: (type) => {
    const saved = savedInternshipsService.getSavedInternships();
    return saved.filter(item => item.type === type);
  }
};

// Helper function to normalize internship data from different APIs
const normalizeInternshipData = (internship, type) => {
  if (type === 'live') {
    // Live internship structure
    return {
      id: internship.jobId,
      title: internship.jobTitle,
      company: internship.employerName,
      location: 'Remote/Global', // Live jobs might not have specific location
      duration: internship.jobEmploymentType || 'Full-time',
      sector: internship.jobEmploymentType || 'Technology',
      description: internship.jobDescription,
      requiredSkills: extractSkillsFromDescription(internship.jobDescription),
      salary: 'Competitive',
      fresherFriendly: 'Unknown',
      applyLink: internship.applyOptions?.[0]?.applyLink || internship.employerWebsite,
      employerWebsite: internship.employerWebsite,
      jobPublisher: internship.jobPublisher,
      originalData: internship // Keep original data for reference
    };
  } else {
    // Regular internship structure (from your existing API)
    return {
      id: internship.id,
      title: internship.title,
      company: internship.company,
      location: internship.location,
      duration: internship.duration,
      sector: internship.sector,
      description: internship.description,
      requiredSkills: internship.requiredSkills,
      salary: internship.salary,
      fresherFriendly: internship.fresherFriendly,
      applyLink: null, // Regular internships might use your internal apply process
      originalData: internship
    };
  }
};

// Helper function to extract skills from job description
const extractSkillsFromDescription = (description) => {
  if (!description) return '';
  
  // Common technical skills to look for
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
    'Angular', 'Vue.js', 'Spring', 'Django', 'Flask', 'MongoDB', 'PostgreSQL',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Machine Learning', 'AI',
    'Data Analysis', 'PHP', 'C++', 'C#', '.NET', 'Ruby', 'Go', 'Swift'
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.slice(0, 5).join(', ') || 'Various Skills';
};

export default savedInternshipsService;