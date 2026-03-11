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
  Building2,
  Users,
  MapPin,
  Star,
  Award,
  TrendingUp,
  Globe,
  Filter,
  Search,
  Eye,
  ExternalLink,
  Heart,
  Calendar,
  DollarSign,
  Target,
  Zap,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const CompaniesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [favoriteCompanies, setFavoriteCompanies] = useState(new Set());
  const [expandedCompany, setExpandedCompany] = useState(null);
  
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

  const categories = [
    { id: 'all', label: 'All Companies', count: 50 },
    { id: 'tech', label: 'Technology', count: 18 },
    { id: 'finance', label: 'Finance & Banking', count: 8 },
    { id: 'consulting', label: 'Consulting', count: 6 },
    { id: 'healthcare', label: 'Healthcare', count: 5 },
    { id: 'automotive', label: 'Automotive', count: 4 },
    { id: 'retail', label: 'E-commerce & Retail', count: 5 },
    { id: 'energy', label: 'Energy & Oil', count: 4 }
  ];

  const companies = [
    // Technology
    {
      id: 1,
      name: 'Google',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg',
      headquarters: 'Mountain View, CA',
      founded: 1998,
      employees: '150,000+',
      rating: 4.4,
      openPositions: 2500,
      description: 'A multinational technology company that specializes in Internet-related services and products.',
      specialties: ['Search', 'Cloud Computing', 'AI/ML', 'Android'],
      benefits: ['Health Insurance', 'Free Meals', 'Stock Options', 'Learning Budget'],
      revenue: '$282.8B',
      website: 'https://www.google.com',
      color: 'from-blue-500 to-green-500'
    },
    {
      id: 2,
      name: 'Microsoft',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg',
      headquarters: 'Redmond, WA',
      founded: 1975,
      employees: '220,000+',
      rating: 4.3,
      openPositions: 1800,
      description: 'A leading technology corporation that develops and supports software, services, devices and solutions.',
      specialties: ['Cloud Computing', 'Office Suite', 'Gaming', 'AI'],
      benefits: ['Healthcare', 'Parental Leave', 'Stock Purchase Plan', 'Tuition Assistance'],
      revenue: '$211.9B',
      website: 'https://www.microsoft.com',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 3,
      name: 'Apple',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
      headquarters: 'Cupertino, CA',
      founded: 1976,
      employees: '164,000+',
      rating: 4.5,
      openPositions: 1200,
      description: 'Designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories.',
      specialties: ['Consumer Electronics', 'Software', 'Digital Services', 'Semiconductors'],
      benefits: ['Health & Wellness', 'Stock Options', 'Employee Discounts', 'Commuter Benefits'],
      revenue: '$394.3B',
      website: 'https://www.apple.com',
      color: 'from-gray-700 to-gray-900'
    },
    {
      id: 4,
      name: 'Meta',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/meta.svg',
      headquarters: 'Menlo Park, CA',
      founded: 2004,
      employees: '86,000+',
      rating: 4.1,
      openPositions: 900,
      description: 'Builds technologies that help people connect, find communities, and grow businesses.',
      specialties: ['Social Media', 'VR/AR', 'AI Research', 'Metaverse'],
      benefits: ['Health Benefits', 'Meals & Snacks', 'Wellness Programs', 'Stock Awards'],
      revenue: '$134.9B',
      website: 'https://www.meta.com',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 5,
      name: 'Amazon',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
      headquarters: 'Seattle, WA',
      founded: 1994,
      employees: '1,540,000+',
      rating: 3.9,
      openPositions: 3200,
      description: 'A multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.',
      specialties: ['E-commerce', 'Cloud Computing', 'Digital Streaming', 'AI'],
      benefits: ['Medical Coverage', 'Retirement Savings', 'Employee Discounts', 'Career Development'],
      revenue: '$574.8B',
      website: 'https://www.amazon.com',
      color: 'from-orange-400 to-yellow-500'
    },
    {
      id: 6,
      name: 'Netflix',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg',
      headquarters: 'Los Gatos, CA',
      founded: 1997,
      employees: '12,800+',
      rating: 4.2,
      openPositions: 150,
      description: 'A streaming entertainment service with TV series, documentaries and feature films.',
      specialties: ['Streaming', 'Content Creation', 'Data Analytics', 'Machine Learning'],
      benefits: ['Unlimited PTO', 'Health Insurance', 'Stock Options', 'Parental Leave'],
      revenue: '$31.6B',
      website: 'https://www.netflix.com',
      color: 'from-red-600 to-red-800'
    },
    // Finance
    {
      id: 7,
      name: 'JPMorgan Chase',
      category: 'finance',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/jpmorgan.svg',
      headquarters: 'New York, NY',
      founded: 2000,
      employees: '293,000+',
      rating: 3.8,
      openPositions: 800,
      description: 'A leading financial services firm and one of the largest banks in the United States.',
      specialties: ['Investment Banking', 'Asset Management', 'Private Banking', 'Commercial Banking'],
      benefits: ['Health Insurance', 'Retirement Plans', 'Tuition Reimbursement', 'Employee Discounts'],
      revenue: '$154.8B',
      website: 'https://www.jpmorganchase.com',
      color: 'from-blue-700 to-blue-900'
    },
    {
      id: 8,
      name: 'Goldman Sachs',
      category: 'finance',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/goldmansachs.svg',
      headquarters: 'New York, NY',
      founded: 1869,
      employees: '45,000+',
      rating: 4.0,
      openPositions: 450,
      description: 'A leading global investment banking, securities and investment management firm.',
      specialties: ['Investment Banking', 'Trading', 'Asset Management', 'Consumer Banking'],
      benefits: ['Comprehensive Healthcare', 'Retirement Benefits', 'Wellness Programs', 'Career Development'],
      revenue: '$47.4B',
      website: 'https://www.goldmansachs.com',
      color: 'from-blue-800 to-indigo-900'
    },
    // Consulting
    {
      id: 9,
      name: 'McKinsey & Company',
      category: 'consulting',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/McKinsey_and_Company_Logo.svg',
      headquarters: 'New York, NY',
      founded: 1926,
      employees: '35,000+',
      rating: 4.3,
      openPositions: 600,
      description: 'A global management consulting firm serving leading businesses, governments, and institutions.',
      specialties: ['Strategy Consulting', 'Operations', 'Digital Transformation', 'Analytics'],
      benefits: ['Health & Wellness', 'Professional Development', 'Global Mobility', 'Sabbatical Programs'],
      revenue: '$15.0B',
      website: 'https://www.mckinsey.com',
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 10,
      name: 'Deloitte',
      category: 'consulting',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/deloitte.svg',
      headquarters: 'London, UK',
      founded: 1845,
      employees: '415,000+',
      rating: 4.0,
      openPositions: 1200,
      description: 'A multinational professional services network providing audit, consulting, financial advisory services.',
      specialties: ['Audit & Assurance', 'Consulting', 'Risk Advisory', 'Tax Services'],
      benefits: ['Flexible Work', 'Health Benefits', 'Learning & Development', 'Well-being Programs'],
      revenue: '$59.3B',
      website: 'https://www.deloitte.com',
      color: 'from-green-600 to-teal-700'
    },
    // Healthcare
    {
      id: 11,
      name: 'Johnson & Johnson',
      category: 'healthcare',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/johnsonandjohnson.svg',
      headquarters: 'New Brunswick, NJ',
      founded: 1886,
      employees: '144,500+',
      rating: 3.9,
      openPositions: 700,
      description: 'An American multinational corporation developing medical devices, pharmaceuticals, and consumer products.',
      specialties: ['Pharmaceuticals', 'Medical Devices', 'Consumer Products', 'R&D'],
      benefits: ['Comprehensive Health', 'Retirement Plans', 'Work-Life Balance', 'Education Assistance'],
      revenue: '$94.9B',
      website: 'https://www.jnj.com',
      color: 'from-red-500 to-pink-600'
    },
    // Automotive
    {
      id: 12,
      name: 'Tesla',
      category: 'automotive',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tesla.svg',
      headquarters: 'Austin, TX',
      founded: 2003,
      employees: '127,855+',
      rating: 3.6,
      openPositions: 800,
      description: 'Designs, develops, manufactures, and sells electric vehicles and energy generation systems.',
      specialties: ['Electric Vehicles', 'Energy Storage', 'Solar Panels', 'Autonomous Driving'],
      benefits: ['Medical Insurance', 'Stock Purchase Plan', 'Free Charging', 'Wellness Programs'],
      revenue: '$96.8B',
      website: 'https://www.tesla.com',
      color: 'from-red-600 to-gray-900'
    },
    // More companies...
    {
      id: 13,
      name: 'Salesforce',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/salesforce.svg',
      headquarters: 'San Francisco, CA',
      founded: 1999,
      employees: '73,000+',
      rating: 4.4,
      openPositions: 900,
      description: 'A cloud-based software company providing customer relationship management services.',
      specialties: ['CRM Software', 'Cloud Computing', 'Analytics', 'AI Platform'],
      benefits: ['Ohana Culture', 'Volunteer Time Off', 'Mindfulness Programs', 'Career Development'],
      revenue: '$31.4B',
      website: 'https://www.salesforce.com',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 14,
      name: 'Adobe',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adobe.svg',
      headquarters: 'San Jose, CA',
      founded: 1982,
      employees: '26,000+',
      rating: 4.5,
      openPositions: 400,
      description: 'A multinational computer software company known for creative and digital marketing solutions.',
      specialties: ['Creative Software', 'Digital Marketing', 'Document Cloud', 'Experience Cloud'],
      benefits: ['Creative Sabbatical', 'Health & Wellness', 'Stock Purchase Plan', 'Learning Fund'],
      revenue: '$19.4B',
      website: 'https://www.adobe.com',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 15,
      name: 'NVIDIA',
      category: 'tech',
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nvidia.svg',
      headquarters: 'Santa Clara, CA',
      founded: 1993,
      employees: '29,600+',
      rating: 4.6,
      openPositions: 650,
      description: 'A technology company that designs graphics processing units for gaming and professional markets.',
      specialties: ['GPUs', 'AI Computing', 'Data Centers', 'Autonomous Vehicles'],
      benefits: ['Health Benefits', 'Stock Options', 'Flexible Work', 'Innovation Time'],
      revenue: '$126.0B',
      website: 'https://www.nvidia.com',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const toggleFavorite = (companyId) => {
    setFavoriteCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const toggleExpand = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
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
                  <div className="text-xs text-gray-500 -mt-1">Partner Companies</div>
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
                Companies
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
                      { icon: Bookmark, label: "Saved Companies", path: "/saved" },
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
            <Building2 className="w-4 h-4 animate-pulse" />
            <span>Explore Top MNC Partners</span>
            <Sparkles className="w-4 h-4 animate-pulse delay-150" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Partner{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Companies
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover opportunities at world's leading companies. From Fortune 500 corporations 
            to innovative startups, find your perfect match among our trusted partners.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search companies by name or speciality..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="lg:w-80">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Filter className="h-6 w-6 text-white" />
              </div>
              Companies
              <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-lg font-bold px-4 py-2 rounded-full border border-indigo-200">
                {filteredCompanies.length} companies
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company, index) => (
              <div
                key={company.id}
                className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-in slide-in-from-bottom-4 duration-700`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  {/* Company Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-16 h-16 bg-gradient-to-r ${company.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="w-8 h-8 text-white filter brightness-0 invert"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <Building2 className="w-8 h-8 text-white hidden" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl text-gray-900 mb-1">{company.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-600">{company.rating}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{company.employees} employees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {company.headquarters}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(company.id)}
                      className={`p-2 rounded-full transition-all ${
                        favoriteCompanies.has(company.id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${favoriteCompanies.has(company.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">{company.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-medium text-gray-600">Founded</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{company.founded}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-gray-600">Open Roles</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{company.openPositions.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <p className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Specialties:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {company.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-medium rounded-lg border border-indigo-200"
                          >
                            {specialty}
                          </span>
                        ))}
                        {company.specialties.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            +{company.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {expandedCompany === company.id && (
                    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-600" />
                          Benefits:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {company.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 shadow-sm"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Revenue</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{company.revenue}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Website</span>
                          </div>
                          <a 
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            Visit Site
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      View Jobs
                    </button>
                    <button 
                      onClick={() => toggleExpand(company.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {expandedCompany === company.id ? 'Less' : 'Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Join These Industry Leaders?
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Start your journey with our partner companies. Over 95% of our students 
              secure internships within 3 months of joining our platform.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                <div className="text-gray-700 font-medium">Partner Companies</div>
              </div>
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-gray-700 font-medium">Active Internships</div>
              </div>
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-pink-600 mb-2">95%</div>
                <div className="text-gray-700 font-medium">Success Rate</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/internship-search')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Internships
              </button>
              <button
                onClick={() => navigate('/live-internships')}
                className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-indigo-200 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Browse Live Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Featured Companies Carousel */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured This Month</h3>
            <p className="text-gray-600">Companies actively hiring interns</p>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {companies.slice(0, 8).map((company) => (
              <div
                key={company.id}
                className="min-w-[280px] bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${company.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="w-6 h-6 text-white filter brightness-0 invert"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <Building2 className="w-6 h-6 text-white hidden" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{company.name}</h4>
                    <p className="text-sm text-gray-600">{company.openPositions} open roles</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.specialties.slice(0, 2).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-white text-gray-700 text-xs font-medium rounded-lg"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;