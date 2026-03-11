import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  ArrowLeft,
  User,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  Sparkles,
  Heart,
  MapPin,
  Clock,
  Building2,
  Code,
  Zap,
  ExternalLink,
  Trash2,
  Search,
  Calendar,
  TrendingUp,
  Filter,
  CheckCircle,
  X,
  Globe,
  Tag,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useSavedInternships } from '../hooks/useSavedInternships';

const SavedInternshipsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('savedAt');
  const [filterType, setFilterType] = useState('all'); // 'all', 'regular', 'live'
  const [openMenu, setOpenMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const {
    savedInternships,
    loading,
    removeSavedInternship,
    clearAllSaved,
    getCountsByType
  } = useSavedInternships();

  const counts = getCountsByType();

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

  const handleRemove = (uniqueId) => {
    const success = removeSavedInternship(uniqueId);
    if (success) {
      console.log('Internship removed from saved list');
    }
  };

  const handleClearAll = () => {
    const success = clearAllSaved();
    if (success) {
      setShowConfirmClear(false);
      console.log('All saved internships cleared');
    }
  };

  // Handle apply button click based on internship type
  const handleApply = (internship) => {
    if (internship.type === 'live' && internship.applyLink) {
      // For live internships, open the external apply link
      window.open(internship.applyLink, '_blank');
    } else if (internship.type === 'live' && internship.employerWebsite) {
      // Fallback to employer website for live internships
      window.open(internship.employerWebsite, '_blank');
    } else {
      // For regular internships, you might want to redirect to your internal application process
      // or show an application modal
      console.log('Apply to regular internship:', internship);
      // You can add your regular internship application logic here
    }
  };

  // Filter and sort saved internships
  const filteredAndSortedInternships = savedInternships
    .filter(internship => {
      // Filter by type
      if (filterType !== 'all' && internship.type !== filterType) return false;
      
      // Filter by search term
      if (!searchTerm) return true;
      return (
        internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'savedAt':
          return new Date(b.savedAt) - new Date(a.savedAt);
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'company':
          return a.company?.localeCompare(b.company) || 0;
        case 'type':
          return a.type?.localeCompare(b.type) || 0;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your saved internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation - Fixed */}
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
                  <div className="text-xs text-gray-500 -mt-1">Saved Collection</div>
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
              <button className="text-indigo-600 font-medium relative">
                Saved Internships
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>Your Saved Collection</span>
            <Bookmark className="w-4 h-4 animate-pulse delay-150" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Saved{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Internships
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Keep track of your favorite opportunities. You have {counts.total} saved internships 
            ({counts.regular} regular, {counts.live} live jobs).
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                <Bookmark className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{counts.regular}</div>
                <div className="text-gray-600">Regular Internships</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{counts.live}</div>
                <div className="text-gray-600">Live Jobs</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{counts.total}</div>
                <div className="text-gray-600">Total Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search saved internships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
              
              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="all">All Types ({counts.total})</option>
                  <option value="regular">Regular ({counts.regular})</option>
                  <option value="live">Live Jobs ({counts.live})</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="savedAt">Recently Saved</option>
                  <option value="title">Title A-Z</option>
                  <option value="company">Company A-Z</option>
                  <option value="type">Type</option>
                </select>
              </div>
            </div>

            {/* Clear All Button */}
            {counts.total > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-6 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Clear All ({counts.total})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Saved Internships */}
        {counts.total === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-16 text-center">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">No saved internships yet</h4>
            <p className="text-gray-600 mb-6 text-lg">Start exploring internships and save your favorites by clicking the heart icon</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/internship-search')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Find Regular Internships
              </button>
              <button
                onClick={() => navigate('/live-internships')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
              >
                Browse Live Jobs
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                Your Collection
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-lg font-bold px-4 py-2 rounded-full border border-indigo-200">
                  {filteredAndSortedInternships.length} showing
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedInternships.map((internship, index) => (
                <div
                  key={internship.uniqueId}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`bg-gradient-to-r ${
                            internship.type === 'live' ? 'from-green-600 to-emerald-600' : 'from-indigo-600 to-purple-600'
                          } p-1.5 rounded-lg`}>
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-indigo-600">{internship.company}</span>
                            {internship.jobPublisher && (
                              <span className="text-xs text-gray-500">via {internship.jobPublisher}</span>
                            )}
                          </div>
                        </div>
                        <h4 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
                          {internship.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`${
                            internship.type === 'live' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          } text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                            {internship.type === 'live' ? <Globe className="h-3 w-3" /> : <Tag className="h-3 w-3" />}
                            {internship.type === 'live' ? 'Live Job' : internship.sector}
                          </span>
                          {internship.fresherFriendly === 'Yes' && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Fresher Friendly
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(internship.uniqueId)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
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

                      <div className="space-y-3">
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <div className="bg-indigo-100 p-1.5 rounded-lg">
                            <Code className="h-4 w-4 text-indigo-600" />
                          </div>
                          Required Skills:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {internship.requiredSkills?.split(',').slice(0, 3).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-block px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {internship.description?.substring(0, 120)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Saved {new Date(internship.savedAt).toLocaleDateString()}</span>
                        </div>
                        {internship.employerWebsite && (
                          <a 
                            href={internship.employerWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Company Site</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleApply(internship)}
                        className={`flex-1 bg-gradient-to-r ${
                          internship.type === 'live' 
                            ? 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                            : 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        } text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                      >
                        <Zap className="h-4 w-4" />
                        {internship.type === 'live' ? 'Apply Externally' : 'Apply Now'}
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clear All */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clear All Saved Internships?</h3>
              <p className="text-gray-600 mb-6">
                This will remove all {counts.total} saved internships ({counts.regular} regular, {counts.live} live jobs) from your collection. 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedInternshipsPage;