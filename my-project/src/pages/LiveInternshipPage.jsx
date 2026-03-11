import React, { useState, useEffect, useRef } from 'react';
import { useSavedInternships } from '../hooks/useSavedInternships';

import { 
  Search, 
  MapPin, 
  Code, 
  Users, 
  Clock, 
  Building2, 
  CheckCircle, 
  X, 
  Filter, 
  Briefcase,
  ArrowLeft,
  User,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Star,
  Heart,
  ExternalLink,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const LiveInternshipsPage = () => {
  const [formData, setFormData] = useState({
    query: '',
    location: '',
    skills: '',
    employmentTypes: ['Internship', 'Full-time']
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { 
    toggleSaveInternship, 
    isInternshipSaved 
  } = useSavedInternships();
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
      try {
        await signOut(auth);
        navigate("/login");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'employmentTypes') {
      setFormData(prev => ({
        ...prev,
        employmentTypes: checked 
          ? [...prev.employmentTypes, value]
          : prev.employmentTypes.filter(type => type !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    setCurrentPage(page);

    try {
      const params = new URLSearchParams();
      
      if (formData.query) params.append('query', formData.query);
      if (formData.location) params.append('location', formData.location);
      if (formData.skills) params.append('skills', formData.skills);
      if (formData.employmentTypes.length > 0) {
        params.append('employmentTypes', formData.employmentTypes.join(','));
      }
      
      params.append('page', page.toString());
      params.append('numPages', '1');

      const response = await fetch(
        `http://localhost:8080/api/live-internships/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch live jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setJobs([]);
    setHasSearched(false);
    setError('');
    setCurrentPage(1);
    setFormData({
      query: '',
      location: '',
      skills: '',
      employmentTypes: ['Internship', 'Full-time']
    });
  };

  const handleToggleSave = (job) => {
    const success = toggleSaveInternship(job, 'live'); // Specify type as 'live'
    if (success) {
      const action = isInternshipSaved(job, 'live') ? 'removed from' : 'added to';
      console.log(`Live job ${action} saved list`);
    }
  };

  const toggleDescription = (jobId) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const truncateDescription = (description, maxLength = 300) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleApply = (job) => {
    if (job.applyOptions && job.applyOptions.length > 0) {
      window.open(job.applyOptions[0].applyLink, '_blank');
    } else if (job.employerWebsite) {
      window.open(job.employerWebsite, '_blank');
    }
  };
  const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation - Same as internship search page */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/welcome")}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3 cursor-pointer transform hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    InternMatch
                  </span>
                  <div className="text-xs text-gray-500 -mt-1">Live Opportunities</div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => navigate("/welcome")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
              </button>
              <button 
                onClick={() => navigate("/internship-search")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
              >
                Find Internships
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
              </button>
              <button className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group">
                Companies
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
              </button>
              <button className="text-indigo-600 font-medium relative">
                Live Internships
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
              </button>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${
                      auth.currentUser?.displayName || "User"
                    }&background=6366f1&color=fff&size=128`}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {auth.currentUser?.displayName || "User"}
                  </div>
                  <div className="text-xs text-gray-500">Premium Member</div>
                </div>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${
                          auth.currentUser?.displayName || "User"
                        }&background=6366f1&color=fff&size=128`}
                        alt="Profile"
                        className="w-12 h-12 rounded-xl border-2 border-indigo-100"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {auth.currentUser?.displayName || "User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {auth.currentUser?.email}
                        </div>
                        <div className="text-xs text-indigo-600 font-medium">Premium Member</div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {[
                      { icon: User, label: "My Profile", path: "/profile" },
                      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
                      { icon: Bookmark, label: "Saved Jobs", path: "/saved" },
                      { icon: Settings, label: "Settings", path: "/settings" }
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          setOpenMenu(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 w-full text-left text-gray-700 hover:text-indigo-600 transition-colors group"
                      >
                        <item.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 w-full text-left text-red-600 font-medium group"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-12 pb-8 px-4 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>Live Jobs • Updated Real-Time</span>
            <Sparkles className="w-4 h-4 animate-pulse delay-150" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Live{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Job Opportunities
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the latest job openings from top companies worldwide. 
            Real-time listings updated directly from employer websites and job boards.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Enhanced Search Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-8 py-8">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200')] opacity-10 bg-cover bg-center"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">Search Live Jobs</h2>
                  <p className="text-indigo-100 text-lg">
                    Find real-time opportunities from companies actively hiring
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Job Query Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Search className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <div>Job Title/Keywords</div>
                    <div className="text-xs text-gray-500 font-normal">What role are you looking for?</div>
                  </div>
                </label>
                <input
                  type="text"
                  name="query"
                  value={formData.query}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Engineer, Data Analyst"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Location Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div>Location</div>
                    <div className="text-xs text-gray-500 font-normal">City, State, or Country</div>
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., India, Remote, New York"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Skills Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Code className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div>Skills</div>
                    <div className="text-xs text-gray-500 font-normal">Technologies/Skills</div>
                  </div>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., Java, Spring Boot, React"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Employment Type */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Briefcase className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div>Employment Type</div>
                    <div className="text-xs text-gray-500 font-normal">Job type preference</div>
                  </div>
                </label>
                <div className="space-y-2">
                  {['Internship', 'Full-time', 'Part-time', 'Contract'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="employmentTypes"
                        value={type}
                        checked={formData.employmentTypes.includes(type)}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Preview */}
            {skillsArray.length > 0 && (
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Skills to Match:
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Search Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching Live Jobs...
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6" />
                    Search Live Jobs
                    <Zap className="h-5 w-5" />
                  </>
                )}
              </button>
              
              {hasSearched && (
                <button
                  onClick={clearResults}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <X className="h-5 w-5" />
                  Clear Search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-1 duration-300">
            <div className="flex items-center gap-3 text-red-800">
              <div className="bg-red-100 p-2 rounded-lg">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="font-bold">Search Error</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && !loading && !error && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                Live Job Results
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-lg font-bold px-4 py-2 rounded-full border border-indigo-200">
                  {jobs.length} live jobs found
                </span>
              </h3>
              
              {jobs.length > 0 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSearch(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white border border-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">Page {currentPage}</span>
                  <button
                    onClick={() => handleSearch(currentPage + 1)}
                    className="bg-white border border-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-16 text-center">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">No live jobs found</h4>
                <p className="text-gray-600 mb-6 text-lg">Try adjusting your search criteria or check back later for new opportunities</p>
                <button
                  onClick={clearResults}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Start New Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {jobs.map((job, index) => (
                  <div
                    key={job.jobId}
                    className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 animate-in slide-in-from-bottom-4 duration-700`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1.5 rounded-lg">
                              <Building2 className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-indigo-600">{job.employerName}</span>
                              {job.jobPublisher && (
                                <span className="text-xs text-gray-500">via {job.jobPublisher}</span>
                              )}
                            </div>
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
                            {job.jobTitle}
                          </h4>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {job.jobEmploymentType}
                            </span>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Live Position
                            </span>
                          </div>
                        </div>
                        <button
    onClick={() => handleToggleSave(job)} // Pass full job object
    className={`p-2 rounded-full transition-all ${
      isInternshipSaved(job, 'live') // Check with 'live' type
        ? 'bg-red-100 text-red-600 hover:bg-red-200'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    <Heart className={`h-4 w-4 ${isInternshipSaved(job, 'live') ? 'fill-current' : ''}`} />
  </button>
                      </div>

                      {/* Job Description */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-600" />
                            Job Description:
                          </p>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {expandedDescriptions.has(job.jobId) ? (
                              <div className="space-y-2">
                                {job.jobDescription.split('\n').map((paragraph, idx) => (
                                  paragraph.trim() && (
                                    <p key={idx} className="text-sm">
                                      {paragraph.trim()}
                                    </p>
                                  )
                                ))}
                              </div>
                            ) : (
                              <p>{truncateDescription(job.jobDescription)}</p>
                            )}
                          </div>
                          {job.jobDescription.length > 300 && (
                            <button
                              onClick={() => toggleDescription(job.jobId)}
                              className="mt-3 text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 transition-colors"
                            >
                              {expandedDescriptions.has(job.jobId) ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  Read More
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {job.employerWebsite && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="bg-indigo-100 p-1.5 rounded-lg">
                              <Globe className="h-4 w-4 text-indigo-600" />
                            </div>
                            <a 
                              href={job.employerWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                            >
                              Company Website
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleApply(job)}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          Apply Now
                        </button>
                        <button 
                          onClick={() => toggleDescription(job.jobId)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          {expandedDescriptions.has(job.jobId) ? 'Less' : 'Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action Section */}
        {!hasSearched && (
          <div className="mt-16 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Zap className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Discover Live Opportunities
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                Search through thousands of real-time job postings from companies actively hiring. 
                Get direct access to application links and start your career journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setFormData({ 
                    query: 'Software Developer', 
                    location: 'India', 
                    skills: 'Java, Spring Boot',
                    employmentTypes: ['Internship', 'Full-time']
                  })}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Try Sample Search
                </button>
                <button
                  onClick={() => navigate('/internship-search')}
                  className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-indigo-200"
                >
                  Browse Regular Internships
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveInternshipsPage;