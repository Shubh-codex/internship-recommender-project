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
  Target,
  Brain,
  BookOpen,
  Play,
  ExternalLink,
  Search,
  Zap,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Lightbulb,
  Code,
  Palette,
  BarChart3,
  Users,
  Globe,
  Shield,
  Wrench,
  Heart,
  Camera,
  PenTool,
  Laptop,
  Database,
  Smartphone,
  Rocket,
  Star,
  ChevronRight,
  Download,
  Youtube,
  FileText,
  Link,
  AlertCircle,
  RefreshCw,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';

const BuildSkillsPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [roadmapData, setRoadmapData] = useState('');
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  
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
      // await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const roleCategories = [
    {
      category: "Technology & Development",
      icon: Code,
      color: "from-blue-500 to-indigo-600",
      roles: [
        { name: "Full Stack Developer", icon: Laptop, description: "Build complete web applications from frontend to backend", popularity: 95, trending: true },
        { name: "Data Scientist", icon: BarChart3, description: "Extract insights from data using ML and statistics", popularity: 92, trending: true },
        { name: "Mobile App Developer", icon: Smartphone, description: "Create native and cross-platform mobile apps", popularity: 88, trending: false },
        { name: "DevOps Engineer", icon: Wrench, description: "Streamline development and deployment processes", popularity: 85, trending: true },
        { name: "Cybersecurity Specialist", icon: Shield, description: "Protect organizations from digital threats", popularity: 90, trending: true },
        { name: "Database Administrator", icon: Database, description: "Design and maintain database systems", popularity: 75, trending: false },
        { name: "AI/ML Engineer", icon: Brain, description: "Develop artificial intelligence and machine learning solutions", popularity: 98, trending: true },
        { name: "Cloud Architect", icon: Globe, description: "Design scalable cloud infrastructure solutions", popularity: 87, trending: true }
      ]
    },
    {
      category: "Design & Creative",
      icon: Palette,
      color: "from-purple-500 to-pink-600",
      roles: [
        { name: "UX/UI Designer", icon: PenTool, description: "Create intuitive and beautiful user experiences", popularity: 92, trending: true },
        { name: "Graphic Designer", icon: Palette, description: "Design visual content for digital and print media", popularity: 82, trending: false },
        { name: "Video Editor", icon: Camera, description: "Create and edit video content for various platforms", popularity: 85, trending: true },
        { name: "3D Artist", icon: Lightbulb, description: "Create 3D models, animations, and visual effects", popularity: 78, trending: true },
        { name: "Brand Designer", icon: Award, description: "Develop visual identity and brand guidelines", popularity: 80, trending: false },
        { name: "Motion Graphics Designer", icon: Play, description: "Create animated graphics and visual effects", popularity: 83, trending: true }
      ]
    },
    {
      category: "Business & Marketing",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      roles: [
        { name: "Digital Marketing Specialist", icon: Target, description: "Drive online growth through digital channels", popularity: 88, trending: true },
        { name: "Product Manager", icon: Rocket, description: "Lead product strategy and development lifecycle", popularity: 91, trending: true },
        { name: "Business Analyst", icon: BarChart3, description: "Analyze business processes and recommend improvements", popularity: 80, trending: false },
        { name: "Content Creator", icon: PenTool, description: "Create engaging content across multiple platforms", popularity: 86, trending: true },
        { name: "Sales Engineer", icon: Users, description: "Combine technical knowledge with sales expertise", popularity: 79, trending: false },
        { name: "Growth Hacker", icon: TrendingUp, description: "Drive rapid business growth through creative strategies", popularity: 84, trending: true }
      ]
    },
    {
      category: "Healthcare & Science",
      icon: Heart,
      color: "from-red-500 to-rose-600",
      roles: [
        { name: "Healthcare Data Analyst", icon: BarChart3, description: "Analyze medical data to improve patient outcomes", popularity: 82, trending: true },
        { name: "Biotech Researcher", icon: Brain, description: "Conduct research in biotechnology and life sciences", popularity: 75, trending: false },
        { name: "Medical Software Developer", icon: Code, description: "Build software solutions for healthcare industry", popularity: 79, trending: true },
        { name: "Clinical Research Coordinator", icon: FileText, description: "Manage and coordinate clinical trials", popularity: 73, trending: false }
      ]
    }
  ];

  const displayedCategories = showAllRoles ? roleCategories : roleCategories.slice(0, 2);

  const generateRoadmap = async () => {
    const role = selectedRole || customRole.trim();
    if (!role) {
      setError('Please select or enter a role');
      return;
    }

    setLoading(true);
    setHasGenerated(false);
    setError('');
    setRoadmapData('');
    setCoursesData([]);

    try {
      // Generate roadmap with better error handling
      const roadmapResponse = await fetch(
        `http://localhost:8080/api/skills/roadmap?role=${encodeURIComponent(role)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (!roadmapResponse.ok) {
        const errorText = await roadmapResponse.text();
        throw new Error(`Server error (${roadmapResponse.status}): ${errorText}`);
      }

      const roadmapResult = await roadmapResponse.json();
      
      if (!roadmapResult.success) {
        throw new Error(roadmapResult.error || 'Failed to generate roadmap');
      }

      if (!roadmapResult.roadmap || roadmapResult.roadmap.trim() === '') {
        throw new Error('No roadmap content received');
      }

      setRoadmapData(roadmapResult.roadmap);

      // Get recommended courses
      try {
        const coursesResponse = await fetch(
          `http://localhost:8080/api/skills/courses?role=${encodeURIComponent(role)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        if (coursesResponse.ok) {
          const coursesResult = await coursesResponse.json();
          if (coursesResult.success && coursesResult.courses) {
            setCoursesData(coursesResult.courses);
          }
        }
      } catch (coursesError) {
        console.warn('Failed to load courses:', coursesError);
        // Don't fail the entire operation if courses fail
      }

      setHasGenerated(true);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError(error.message || 'Failed to generate roadmap. Please check your internet connection and try again.');
      setRoadmapData('');
      setHasGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  const formatRoadmap = (text) => {
    if (!text) return <div className="text-gray-500 italic">No roadmap content available</div>;
    
    // Try to split into numbered sections first
    let sections = text.split(/(?=\d+\.\s+[A-Z\s]*:)/);
    
    // If no numbered sections found, try to split by common section headers
    if (sections.length <= 1) {
      sections = text.split(/(?=(?:PREREQUISITES|CORE SKILLS|LEARNING PATH|RECOMMENDED TIMELINE|PRACTICAL PROJECTS|CERTIFICATIONS|CAREER TIPS|Prerequisites|Core Skills|Learning Path|Timeline|Projects|Certifications|Career Tips))/i);
    }
    
    // If still no sections, display as single content block
    if (sections.length <= 1) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {text}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      const lines = section.trim().split('\n');
      let title = lines[0];
      let content = lines.slice(1).join('\n').trim();
      
      // Clean up title - remove numbers and colons
      title = title.replace(/^\d+\.\s*/, '').replace(/:$/, '').trim();
      
      // If title is too long, it might be part of content
      if (title.length > 100) {
        content = section.trim();
        title = `Section ${index + 1}`;
      }
      
      // Choose icon based on title content
      let sectionIcon = '📋';
      if (title.toLowerCase().includes('prerequisite') || title.toLowerCase().includes('basic')) {
        sectionIcon = '🎯';
      } else if (title.toLowerCase().includes('core') || title.toLowerCase().includes('skill')) {
        sectionIcon = '🛠️';
      } else if (title.toLowerCase().includes('learning') || title.toLowerCase().includes('path')) {
        sectionIcon = '🗺️';
      } else if (title.toLowerCase().includes('timeline') || title.toLowerCase().includes('schedule')) {
        sectionIcon = '⏰';
      } else if (title.toLowerCase().includes('project')) {
        sectionIcon = '🚀';
      } else if (title.toLowerCase().includes('certification') || title.toLowerCase().includes('certificate')) {
        sectionIcon = '🏆';
      } else if (title.toLowerCase().includes('career') || title.toLowerCase().includes('tip')) {
        sectionIcon = '💡';
      }
      
      return (
        <div key={`section-${index}`} className="mb-8 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h4 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">{sectionIcon}</span>
                <span>{title}</span>
              </h4>
            </div>
            <div className="p-6">
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const mockResources = [
    { 
      title: "GitHub", 
      type: "Code Repository", 
      icon: Code,
      description: "Host and collaborate on code projects",
      link: "https://github.com",
      color: "from-gray-600 to-gray-800"
    },
    { 
      title: "Stack Overflow", 
      type: "Q&A Community", 
      icon: Users,
      description: "Get help from developer community",
      link: "https://stackoverflow.com",
      color: "from-orange-500 to-red-600"
    },
    { 
      title: "FreeCodeCamp", 
      type: "Interactive Learning", 
      icon: Code,
      description: "Free coding curriculum with projects",
      link: "https://freecodecamp.org",
      color: "from-green-500 to-emerald-600"
    },
    { 
      title: "MDN Web Docs", 
      type: "Documentation", 
      icon: FileText,
      description: "Comprehensive web development docs",
      link: "https://developer.mozilla.org",
      color: "from-blue-500 to-indigo-600"
    },
    { 
      title: "Coursera", 
      type: "Online Courses", 
      icon: BookOpen,
      description: "University-level courses online",
      link: "https://coursera.org",
      color: "from-blue-600 to-purple-600"
    },
    { 
      title: "YouTube", 
      type: "Video Learning", 
      icon: Youtube,
      description: "Free educational video content",
      link: "https://youtube.com",
      color: "from-red-500 to-red-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/welcome")}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
              </button>
              <div className="flex items-center gap-3 cursor-pointer transform hover:scale-105 transition-transform" onClick={() => navigate("/welcome")}>
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
                  <div className="text-xs text-gray-500 -mt-1">AI Skill Builder</div>
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
                Build Skills
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
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
                    src={`https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=128`}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    User
                  </div>
                  <div className="text-xs text-gray-500">Premium Member</div>
                </div>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=128`}
                        alt="Profile"
                        className="w-12 h-12 rounded-xl border-2 border-indigo-100"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          User
                        </div>
                        <div className="text-sm text-gray-500">
                          user@example.com
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
      <section className={`pt-16 pb-12 px-4 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-8 py-4 rounded-full text-sm font-semibold mb-8 shadow-lg border border-indigo-200">
            <Brain className="w-5 h-5 animate-pulse" />
            <span>Powered by Google Gemini AI</span>
            <Rocket className="w-5 h-5 animate-pulse delay-150" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dream Career
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Get personalized learning roadmaps powered by advanced AI. Choose your dream role and 
            discover the exact skills, courses, and resources you need to succeed in today's competitive market.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>AI-Generated Roadmaps</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Curated Course Recommendations</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Industry Resources</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-red-800">Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto p-1 hover:bg-red-100 rounded-lg"
              >
                <X className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        )}

        {/* Role Selection Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">Choose Your Dream Role</h2>
                <p className="text-indigo-100">
                  Select from popular careers or enter your own path
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Predefined Roles */}
            {displayedCategories.map((category, i) => (
              <div key={i} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <category.icon className="w-5 h-5 text-indigo-600" />
                  {category.category}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.roles.map((role, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedRole(role.name);
                        setCustomRole('');
                      }}
                      className={`group p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                        selectedRole === role.name
                          ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg scale-105"
                          : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl transition-colors ${
                          selectedRole === role.name 
                            ? "bg-indigo-600 text-white" 
                            : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                        }`}>
                          <role.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">{role.name}</h4>
                          {role.trending && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                              🔥 Trending
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-left">{role.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${role.popularity}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{role.popularity}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {!showAllRoles && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowAllRoles(true)}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 font-semibold rounded-xl transition-all duration-200 hover:scale-105 border border-indigo-200"
                >
                  <span className="flex items-center gap-2">
                    Show More Roles
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            )}

            {/* Custom Role Input */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600" />
                Or Enter Your Custom Role
              </label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedRole('');
                  }
                }}
                placeholder="e.g., Blockchain Developer, Game Designer, Product Manager..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white"
              />
              <p className="text-sm text-gray-500 mt-2">
                Can't find your dream role? Type it here and our AI will create a personalized roadmap!
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={generateRoadmap}
                disabled={loading || (!selectedRole && !customRole.trim())}
                className="flex-1 sm:flex-none px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating AI Roadmap...</span>
                    <Brain className="h-5 w-5 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Rocket className="h-6 w-6" />
                    <span>Generate AI Roadmap</span>
                    <Sparkles className="h-5 w-5" />
                  </>
                )}
              </button>
              
              {hasGenerated && (
                <button
                  onClick={() => {
                    setHasGenerated(false);
                    setRoadmapData('');
                    setCoursesData([]);
                    setSelectedRole('');
                    setCustomRole('');
                    setError('');
                  }}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <RefreshCw className="h-5 w-5" />
                  Start Over
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="h-8 w-8 text-indigo-600 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900">AI is crafting your roadmap...</h2>
                <Sparkles className="h-8 w-8 text-purple-600 animate-pulse delay-150" />
              </div>
              <p className="text-gray-600 mb-8">This may take a few moments as we analyze the best learning path for you</p>
              
              {/* Skeleton Loading */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-200 rounded-xl"></div>
                        <div className="h-6 bg-indigo-200 rounded-lg w-1/3"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-indigo-200 rounded w-full"></div>
                        <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                        <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Output */}
        {hasGenerated && roadmapData && !loading && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-1">Your AI-Generated Roadmap</h2>
                    <p className="text-indigo-100">
                      Personalized learning path for {selectedRole || customRole}
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                  <span className="text-white font-semibold text-sm">Powered by Gemini AI</span>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Generated on {new Date().toLocaleDateString()}</span>
              </div>
              {formatRoadmap(roadmapData)}
            </div>
          </div>
        )}

        {/* Recommended Courses */}
        {hasGenerated && coursesData.length > 0 && !loading && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-1">Recommended Courses</h2>
                  <p className="text-green-100">
                    Curated learning resources to accelerate your journey
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {coursesData.map((course, idx) => (
                  <div
                    key={idx}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {course.provider}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        {course.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{course.rating}</span>
                          <span>• {course.students} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>{course.duration}</span>
                          <span>• {course.price}</span>
                        </div>
                      </div>
                      
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                      >
                        <span>Enroll Now</span>
                        <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Extra Resources */}
        {hasGenerated && !loading && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-1">Additional Resources</h2>
                  <p className="text-orange-100">
                    Essential tools and platforms for your learning journey
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockResources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-6 rounded-2xl bg-gradient-to-r ${resource.color} text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <resource.icon className="w-6 h-6" />
                      <h3 className="font-bold text-lg">{resource.title}</h3>
                    </div>
                    <p className="text-sm opacity-90 mb-3">{resource.description}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span>Explore Resource</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildSkillsPage