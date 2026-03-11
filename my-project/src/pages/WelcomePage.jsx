import React, { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Target,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Building,
  Award,
  User,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  Zap,
  Globe,
  Clock,
  Trophy,
  Sparkles,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const WelcomePage = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({ internships: 0, companies: 0, success: 0 });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate numbers
    const interval = setInterval(() => {
      setAnimatedNumbers(prev => ({
        internships: Math.min(prev.internships + 100, 10000),
        companies: Math.min(prev.companies + 5, 500),
        success: Math.min(prev.success + 1, 95)
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 3);
    }, 4000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => {
      clearInterval(statInterval);
      clearInterval(testimonialInterval);
    };
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

  const stats = [
    { 
      number: `${animatedNumbers.internships.toLocaleString()}+`, 
      label: "Active Internships", 
      icon: Briefcase,
      color: "from-blue-500 to-indigo-600"
    },
    { 
      number: `${animatedNumbers.companies}+`, 
      label: "Partner Companies", 
      icon: Building,
      color: "from-purple-500 to-pink-600"
    },
    { 
      number: `${animatedNumbers.success}%`, 
      label: "Success Rate", 
      icon: Award,
      color: "from-green-500 to-emerald-600"
    },
  ];

  const features = [
    {
      icon: Target,
      title: "AI-Powered Matching",
      description: "Advanced algorithms analyze your profile to find perfect internship matches",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "Industry Network",
      description: "Connect with 10,000+ professionals and mentors across top companies",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Career Analytics",
      description: "Track your progress with detailed insights and personalized recommendations",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Instant Applications",
      description: "Apply to multiple internships with one-click using your optimized profile",
      color: "from-orange-500 to-red-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineering Intern",
      company: "Google",
      text: "InternMatch's AI matching helped me land my dream role at Google! The personalized recommendations were incredibly accurate.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      rating: 5
    },
    {
      name: "Raj Patel",
      role: "Marketing Intern", 
      company: "Microsoft",
      text: "Found my perfect internship in just 2 weeks! The platform's insights gave me exactly what I needed to succeed.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Data Science Intern",
      company: "Meta",
      text: "The career analytics feature helped me understand exactly which skills to develop. Now I'm interning at Meta!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      rating: 5
    }
  ];

  const companies = [
    "Google", "Microsoft", "Meta", "Apple", "Amazon", "Netflix", "Tesla", "Airbnb"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with animation */}
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
                <div className="text-xs text-gray-500 -mt-1">AI-Powered Platform</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => navigate("/internships")}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
              >
                Find Internships
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
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
<button
  onClick={() => navigate("/build-skills")}
  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
>
  Build Skills
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

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        className={`pt-20 pb-32 px-4 relative overflow-hidden transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <Star className="w-4 h-4 animate-pulse" />
            <span>Welcome to the Future of Internships</span>
            <Sparkles className="w-4 h-4 animate-pulse delay-150" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Your Gateway to{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Dream Internships
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Powered by cutting-edge AI technology, InternMatch revolutionizes how talented 
            students discover and secure their perfect internship opportunities. Join thousands 
            of successful students who've transformed their careers with us.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={() => navigate("/internships")}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <Zap className="w-6 h-6 group-hover:animate-pulse" />
              Find Your Perfect Match
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="group inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-indigo-200 shadow-xl">
              <Play className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`group relative bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 ${
                    currentStat === index ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                  
                  {/* Animated border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Trophy className="w-4 h-4" />
              Why Choose InternMatch
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Features That Set Us Apart
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of internship discovery with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Users className="w-4 h-4" />
              Success Stories
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful students who found their dream internships
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
              
              <div className="relative z-10">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-500 ${
                      index === currentTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <blockquote className="text-2xl font-medium text-gray-900 mb-8 italic leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>
                      
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                        />
                        <div className="text-left">
                          <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                          <div className="text-indigo-600 font-medium">{testimonial.role}</div>
                          <div className="text-gray-500 text-sm">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-indigo-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Building className="w-4 h-4" />
              Trusted Partners
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Join Interns at Top Companies
            </h3>
            <p className="text-gray-600">Our students have secured internships at these industry leaders</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity">
            {companies.map((company, index) => (
              <div
                key={index}
                className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">InternMatch</span>
                  <div className="text-sm text-gray-400">AI-Powered Platform</div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Revolutionizing how students discover and secure their dream internships 
                through cutting-edge AI technology and personalized matching.
              </p>
              <div className="flex gap-4 mt-6">
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Users className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <div className="space-y-3">
                {["Find Internships", "Companies", "Resources", "Success Stories"].map((link, index) => (
                  <button key={index} className="block text-gray-300 hover:text-white transition-colors">
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <div className="space-y-3">
                {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link, index) => (
                  <button key={index} className="block text-gray-300 hover:text-white transition-colors">
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InternMatch. All rights reserved. Made with ❤️ for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;