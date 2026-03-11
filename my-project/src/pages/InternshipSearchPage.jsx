import React, { useState, useEffect, useRef } from 'react';
import {useSavedInternships}  from '../hooks/useSavedInternships.js';
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
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const InternshipSearchPage = () => {
  const [formData, setFormData] = useState({
    skills: '',
    location: '',
    fresherFriendly: false
  });
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { 
  savedInternshipIds, 
  toggleSaveInternship, 
  isInternshipSaved 
} = useSavedInternships();

  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Close dropdown if clicked outside
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = async () => {
  setLoading(true);
  setError('');
  setHasSearched(true);

  try {
    // Build query parameters
    const params = new URLSearchParams();

    if (formData.skills) {
      params.append('skills', formData.skills);
    }

    if (formData.location) {
      params.append('location', formData.location);
    }

    if (formData.fresherFriendly) {
      params.append('fresher_friendly', 'yes');
    }

    // Make API call to backend
    const response = await fetch(
      `http://localhost:8080/api/internships/search?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform backend data to match frontend format
    const transformedInternships = data.map((internship) => ({
      id: internship.id,
      title: internship.title,
      sector: internship.sector,
      location: internship.location,
      duration: internship.duration,
      fresherFriendly: internship.fresherFriendly,
      requiredSkills: internship.requiredSkills
        ? internship.requiredSkills
            .split(',')
            .map((skill) => skill.trim())
            .join(', ')
        : '',
      company: internship.company || 'Company', // use backend if exists
      salary: internship.salary || 'Competitive',
      description:
        internship.description ||
        `Join our team as a ${internship.title} and work with ${internship.requiredSkills}.`,
    }));

    setInternships(transformedInternships);
  } catch (err) {
    setError('Failed to fetch internships. Please try again.');
    console.error('Error fetching internships:', err);
  } finally {
    setLoading(false);
  }
};


  const clearResults = () => {
    setInternships([]);
    setHasSearched(false);
    setError('');
    setFormData({
      skills: '',
      location: '',
      fresherFriendly: false
    });
  };

  const handleToggleSave = (internship) => {
    const success = toggleSaveInternship(internship, 'regular'); // Specify type as 'regular'
    if (success) {
      const action = isInternshipSaved(internship, 'regular') ? 'removed from' : 'added to';
      console.log(`Internship ${action} saved list`);
    }
  };

  const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with back button */}
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
                  <div className="text-xs text-gray-500 -mt-1">Find Your Dream Role</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => navigate("/welcome")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
              >

                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
              </button>
              <button className="text-indigo-600 font-medium relative">
                Find Internships
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
              </button>
              <button
              onClick={() => navigate("/companies")}
  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
  >

  Companies
  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
</button>              
   <button
  onClick={() => navigate("/live-internships")}
  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
>
  Live Internships
  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
</button>

            </div>

            {/* Profile Dropdown */}
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

              {/* Enhanced Dropdown */}
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

                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { icon: User, label: "My Profile", path: "/profile" },
                      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
                      { icon: Bookmark, label: "Saved Internships", path: "/saved" },
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
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <Search className="w-4 h-4 animate-pulse" />
            <span>Discover Your Perfect Internship</span>
            <Sparkles className="w-4 h-4 animate-pulse delay-150" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Dream Internship
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Search through thousands of internship opportunities from top companies. 
            Filter by skills, location, and experience level to find your perfect match.
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
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">Find Your Perfect Match</h2>
                  <p className="text-indigo-100 text-lg">
                    Use our advanced search to discover opportunities tailored to your skills
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Skills Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Code className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <div>Technical Skills</div>
                    <div className="text-xs text-gray-500 font-normal">What technologies do you know?</div>
                  </div>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Python, Machine Learning, SQL"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500">Separate multiple skills with commas</p>
              </div>

              {/* Location Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div>Preferred Location</div>
                    <div className="text-xs text-gray-500 font-normal">Where do you want to work?</div>
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, San Francisco, New York"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Fresher Friendly Toggle */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div>Fresher Friendly</div>
                    <div className="text-xs text-gray-500 font-normal">No experience required</div>
                  </div>
                </label>
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, fresherFriendly: !prev.fresherFriendly }))}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg ${
                      formData.fresherFriendly ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                        formData.fresherFriendly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-bold ${formData.fresherFriendly ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.fresherFriendly ? 'Yes, show beginner roles' : 'No preference'}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Preview */}
            {skillsArray.length > 0 && (
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Selected Skills:
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
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching Amazing Opportunities...
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6" />
                    Search Internships
                    <Sparkles className="h-5 w-5" />
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
                Search Results
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-lg font-bold px-4 py-2 rounded-full border border-indigo-200">
                  {internships.length} opportunities found
                </span>
              </h3>
            </div>

            {internships.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-16 text-center">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">No internships found</h4>
                <p className="text-gray-600 mb-6 text-lg">Try adjusting your search criteria or removing some filters</p>
                <button
                  onClick={clearResults}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Clear Filters & Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {internships.map((internship, index) => (
                  <div
                    key={internship.id}
                    className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-in slide-in-from-bottom-4 duration-700`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1.5 rounded-lg">
                              <Building2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-indigo-600">{internship.company}</span>
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
                            {internship.title}
                          </h4>
                          <p className="text-purple-600 font-semibold text-sm bg-purple-50 px-3 py-1 rounded-full inline-block">
                            {internship.sector}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {internship.fresherFriendly === 'Yes' && (
                            <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                              <CheckCircle className="h-3 w-3" />
                              Fresher Friendly
                            </div>
                          )}
                          <button
  onClick={() => handleToggleSave(internship, 'regular')}
  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
    isInternshipSaved(internship, 'regular')
      ? 'bg-red-100 text-red-600 hover:bg-red-200'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }`}
>
  <Heart className={`w-4 h-4 ${isInternshipSaved(internship, 'regular') ? 'fill-current' : ''}`} />
</button>

                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="bg-blue-100 p-1.5 rounded-lg">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{internship.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="bg-green-100 p-1.5 rounded-lg">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">{internship.duration}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="bg-yellow-100 p-1.5 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-yellow-600" />
                          </div>
                          <span className="font-medium">{internship.salary}</span>
                        </div>

                        <div className="space-y-3">
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <div className="bg-indigo-100 p-1.5 rounded-lg">
                              <Code className="h-4 w-4 text-indigo-600" />
                            </div>
                            Required Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {internship.requiredSkills.split(',').map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="inline-block px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <p className="text-sm text-gray-600 leading-relaxed">{internship.description}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                          <Zap className="h-4 w-4" />
                          Apply Now
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View Details
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
                  <Globe className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Launch Your Career?
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                Join thousands of students who have found their dream internships through our platform. 
                Start your search today and take the first step towards your future!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setFormData({ skills: 'React, JavaScript', location: 'Remote', fresherFriendly: true })}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Try Sample Search
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-indigo-200"
                >
                  Complete Your Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipSearchPage;