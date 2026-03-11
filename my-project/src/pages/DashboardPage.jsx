import React, { useEffect, useState } from "react";
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
  ArrowLeft,
  Edit3,
  ExternalLink,
  Award,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Bookmark,
  Calendar,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileViews: 0,
    matchScore: 0,
    savedInternships: 0,
    applications: 0
  });
  
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data());
          
          // Simulate stats calculation based on profile completeness
          const data = docSnap.data();
          const completeness = calculateProfileCompleteness(data);
          
          setStats({
            profileViews: Math.floor(completeness * 0.5), // Views based on completeness
            matchScore: Math.min(95, 70 + (completeness * 0.3)), // Score between 70-95
            savedInternships: Math.floor(Math.random() * 5) + 2, // Random for demo
            applications: Math.floor(Math.random() * 3) + 1 // Random for demo
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const calculateProfileCompleteness = (data) => {
    const fields = ['username', 'email', 'education', 'skills', 'desiredInternship'];
    const optionalFields = ['preferredLocation', 'experience', 'linkedin', 'github'];
    
    const requiredComplete = fields.filter(field => data[field]?.trim()).length;
    const optionalComplete = optionalFields.filter(field => data[field]?.trim()).length;
    
    return Math.round(((requiredComplete / fields.length) * 70) + ((optionalComplete / optionalFields.length) * 30));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-3xl shadow-2xl p-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">Create your profile to access your personalized dashboard and start discovering internships.</p>
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const completeness = calculateProfileCompleteness(profile);
  const profileData = [
    { key: 'Name', value: profile.username, icon: User },
    { key: 'Email', value: profile.email, icon: Mail },
    { key: 'Education', value: profile.education, icon: GraduationCap },
    { key: 'Skills', value: profile.skills, icon: Code },
    { key: 'Desired Role', value: profile.desiredInternship, icon: Target },
    { key: 'Location', value: profile.preferredLocation || 'Not specified', icon: MapPin },
    { key: 'Experience', value: profile.experience || 'Not specified', icon: Briefcase },
  ];

  const quickStats = [
    { label: 'Profile Views', value: stats.profileViews, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Match Score', value: `${stats.matchScore}%`, icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { label: 'Saved', value: stats.savedInternships, icon: Bookmark, color: 'from-purple-500 to-pink-600' },
    { label: 'Applied', value: stats.applications, icon: CheckCircle, color: 'from-orange-500 to-red-600' },
  ];

  const recentActivities = [
    { type: 'view', message: 'Your profile was viewed by TechCorp recruiter', time: '2 hours ago', icon: Users },
    { type: 'match', message: 'New internship match: Frontend Developer at StartupXYZ', time: '1 day ago', icon: Star },
    { type: 'save', message: 'You saved Data Analyst role at DataCorp', time: '2 days ago', icon: Bookmark },
    { type: 'update', message: 'Profile updated successfully', time: '3 days ago', icon: Edit3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/welcome")}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-500">Welcome back, {profile.username}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-1">Profile Overview</h2>
                    <p className="text-indigo-100">Your professional snapshot</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{completeness}%</div>
                    <div className="text-indigo-100 text-sm">Complete</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-1000 ease-out"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profileData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-500">{item.key}</div>
                          <div className="text-gray-900 font-medium truncate" title={item.value}>
                            {item.value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Social Links */}
                {(profile.linkedin || profile.github) && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
                    <div className="flex gap-4">
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/internships")}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl hover:from-indigo-100 hover:to-purple-100 transition-colors group"
                >
                  <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Find Internships</div>
                    <div className="text-sm text-gray-600">Discover new opportunities</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-colors group">
                  <div className="bg-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Schedule Mock Interview</div>
                    <div className="text-sm text-gray-600">Practice with experts</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-colors group">
                  <div className="bg-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Skill Assessment</div>
                    <div className="text-sm text-gray-600">Test your abilities</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Recommendations */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profile Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Profile Tips
              </h3>
              <div className="space-y-3">
                {completeness < 80 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Complete your profile</p>
                      <p className="text-xs text-yellow-600">Add missing information to get better matches</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Great profile activity!</p>
                    <p className="text-xs text-green-600">Your profile is attracting recruiter attention</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <Star className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Keep exploring</p>
                    <p className="text-xs text-blue-600">Check out new internship postings daily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/welcome')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Back to Home</span>
                </button>
                <button
                  onClick={() => navigate('/internships')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Browse Internships</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;