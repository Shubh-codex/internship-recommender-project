import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Code, 
  Target, 
  MapPin, 
  Briefcase, 
  Linkedin, 
  Github,
  Save,
  Home,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Award,
  Clock,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    education: "",
    skills: "",
    desiredInternship: "",
    preferredLocation: "",
    experience: "",
    linkedin: "",
    github: "",
  });
  
  const navigate = useNavigate();
  const user = auth.currentUser;
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

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            username: data.username || user.displayName || "",
            email: data.email || user.email || "",
            education: data.education || "",
            skills: data.skills || "",
            desiredInternship: data.desiredInternship || "",
            preferredLocation: data.preferredLocation || "",
            experience: data.experience || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
          });
        } else {
          // Set default values if no profile exists
          setProfile(prev => ({
            ...prev,
            username: user.displayName || "",
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setSaveStatus('error');
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    // Clear save status when user makes changes
    if (saveStatus) setSaveStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSaveStatus('saving');
    
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date().toISOString(),
        uid: user.uid
      }, { merge: true });
      
      setSaveStatus('saved');
      
      // Reset save status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { 
      name: "username", 
      label: "Full Name", 
      type: "text", 
      icon: User, 
      placeholder: "John Doe", 
      required: true,
      description: "Your professional name as it will appear to recruiters"
    },
    { 
      name: "email", 
      label: "Email Address", 
      type: "email", 
      icon: Mail, 
      placeholder: "you@example.com", 
      required: true,
      description: "Primary email for internship communications"
    },
    { 
      name: "education", 
      label: "Education", 
      type: "text", 
      icon: GraduationCap, 
      placeholder: "B.Tech in Computer Science, XYZ University", 
      required: true,
      description: "Your current degree and institution"
    },
    { 
      name: "skills", 
      label: "Technical Skills", 
      type: "text", 
      icon: Code, 
      placeholder: "Java, Python, React, Machine Learning, Data Analysis", 
      required: true,
      description: "Separate multiple skills with commas"
    },
    { 
      name: "desiredInternship", 
      label: "Desired Internship Role", 
      type: "text", 
      icon: Target, 
      placeholder: "Software Engineer, Data Scientist, Product Manager", 
      required: true,
      description: "Types of roles you're interested in"
    },
    { 
      name: "preferredLocation", 
      label: "Preferred Location", 
      type: "text", 
      icon: MapPin, 
      placeholder: "Delhi, Bangalore, Remote, Hybrid", 
      required: false,
      description: "Your location preferences for internships"
    },
    { 
      name: "experience", 
      label: "Experience & Projects", 
      type: "text", 
      icon: Briefcase, 
      placeholder: "6 months internship at ABC Corp, Built e-commerce website", 
      required: false,
      description: "Previous internships, projects, or relevant experience"
    },
    { 
      name: "linkedin", 
      label: "LinkedIn Profile", 
      type: "url", 
      icon: Linkedin, 
      placeholder: "https://linkedin.com/in/your-profile", 
      required: false,
      description: "Your LinkedIn profile URL"
    },
    { 
      name: "github", 
      label: "GitHub Profile", 
      type: "url", 
      icon: Github, 
      placeholder: "https://github.com/your-username", 
      required: false,
      description: "Your GitHub profile URL (for tech roles)"
    },
  ];

  const getCompletionPercentage = () => {
    const requiredFields = inputFields.filter(field => field.required);
    const filledRequired = requiredFields.filter(field => profile[field.name].trim() !== "");
    const optionalFields = inputFields.filter(field => !field.required);
    const filledOptional = optionalFields.filter(field => profile[field.name].trim() !== "");
    
    const requiredWeight = 70;
    const optionalWeight = 30;
    
    const requiredScore = (filledRequired.length / requiredFields.length) * requiredWeight;
    const optionalScore = (filledOptional.length / optionalFields.length) * optionalWeight;
    
    return Math.round(requiredScore + optionalScore);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();

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
                  <div className="text-xs text-gray-500 -mt-1">Complete Your Profile</div>
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
              <button 
                onClick={() => navigate("/internships")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
              >
                Find Internships
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
              </button>
              <button className="text-indigo-600 font-medium relative">
                My Profile
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
                      { icon: User, label: "My Profile", path: "/profile", active: true },
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
                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 w-full text-left transition-colors group ${
                          item.active ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`} />
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
            <User className="w-4 h-4 animate-pulse" />
            <span>Build Your Professional Profile</span>
            <Sparkles className="w-4 h-4 animate-pulse delay-150" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Complete Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Professional Profile
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Stand out to top recruiters by completing your profile with detailed information about 
            your skills, experience, and career aspirations.
          </p>

          {/* Profile Completion Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - completionPercentage / 100)}`}
                  className="text-indigo-600"
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-indigo-600">{completionPercentage}%</span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-gray-900">Profile Complete</div>
              <div className="text-gray-600">
                {completionPercentage < 100 ? 'Keep going to unlock all features!' : 'Excellent! Your profile is complete.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-8 py-12">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200')] opacity-10 bg-cover bg-center"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur p-4 rounded-2xl">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-white">
                  <h2 className="text-4xl font-bold mb-2">Build Your Profile</h2>
                  <p className="text-indigo-100 text-lg">
                    Complete your profile to unlock personalized internship recommendations
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span className="text-indigo-100">Stand out to top recruiters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Status Messages */}
            {saveStatus === 'saved' && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 animate-in slide-in-from-top-1 duration-300">
                <div className="flex items-center gap-3 text-green-800">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">Profile saved successfully!</div>
                    <div className="text-sm text-green-600">Your information has been updated and is now visible to recruiters.</div>
                  </div>
                </div>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 text-red-800">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">Failed to save profile</div>
                    <div className="text-sm text-red-600">Please check your connection and try again.</div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map((field) => {
                  const IconComponent = field.icon;
                  const isLarge = ['skills', 'experience'].includes(field.name);
                  
                  return (
                    <div key={field.name} className={isLarge ? 'md:col-span-2' : ''}>
                      <label className="flex items-center gap-3 text-sm font-bold text-gray-800 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <IconComponent className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {field.label}
                            {field.required && <span className="text-red-500 text-xs">*</span>}
                          </div>
                          <div className="text-xs text-gray-500 font-normal">{field.description}</div>
                        </div>
                      </label>
                      
                      <div className="relative">
                        <input
                          type={field.type}
                          name={field.name}
                          value={profile[field.name]}
                          onChange={handleChange}
                          required={field.required}
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                          placeholder={field.placeholder}
                        />
                        {profile[field.name] && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {saveStatus === 'saving' ? 'Saving Profile...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>

              {/* Navigation Buttons - Always Visible */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 text-lg shadow-lg"
                >
                  <BarChart3 className="h-6 w-6" />
                  View Dashboard
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/welcome')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 text-lg shadow-lg"
                >
                  <Home className="h-6 w-6" />
                  Back to Home
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-8 shadow-lg">
          <div className="flex items-start gap-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                💡 Profile Optimization Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use industry-relevant keywords in your skills</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Quantify your experience and achievements</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep your GitHub and LinkedIn profiles updated</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be specific about your preferred role types</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-indigo-700">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Complete profiles get 3x more responses!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;