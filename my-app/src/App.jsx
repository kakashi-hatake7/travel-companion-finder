import React, { useState, useEffect } from 'react';
import { Users, MapPin, Clock, Phone, Search, Bell, Plus, X, Sparkles, ArrowRight, Navigation, LogIn, LogOut, User, Send } from 'lucide-react';
import { WavyBackground } from './components/ui/wavy-background';
import { BackgroundGradient } from './components/ui/background-gradient';
import AuthPage from './components/auth/AuthPage';
import ProfilePage from './components/profile/ProfilePage';
import InteractiveGlobe from './components/globe/InteractiveGlobe';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';

export default function TravelCompanionFinder() {
  const [view, setView] = useState('home');
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    startPoint: '',
    date: '',
    time: '',
    contact: ''
  });
  const [searchFilters, setSearchFilters] = useState({
    destination: '',
    startPoint: '',
    date: ''
  });
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('');
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const destinations = [
    'Abohar', 'Abuja', 'Adoni', 'Agartala', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola',
    'Aligarh', 'Alwar', 'Amravati', 'Amreli', 'Amritsar', 'Anantapuram', 'Andaman & Nicobar Islands', 'Asansol',
    'Aurangabad', 'Ayodhya', 'Azamgarh', 'Ballari', 'Ballia', 'Balasore', 'Bangalore', 'Bansberia', 'Bareilly',
    'Baripada', 'Bathinda', 'Belagavi', 'Benin City', 'Berhampur', 'Bhadrak', 'Bhadreswar', 'Bhagalpur',
    'Bharatpur', 'Bhavnagar', 'Bhilai', 'Bhiwadi', 'Bhiwani', 'Bhopal', 'Bhubaneswar', 'Bhuj', 'Bhusawal',
    'Bidar', 'Bilaspur', 'Biratnagar', 'Birgunj', 'Bokaro Steel City', 'Butwal', 'Casablanca', 'Chandigarh',
    'Chandrapur', 'Chhapra', 'Chiba', 'Chirkunda', 'Chennai', 'Chittoor', 'Coimbatore', 'Cuttack', 'Dadra & Nagar Haveli',
    'Daman & Diu', 'Darjeeling', 'Darbhanga', 'Davanagere', 'Delhi', 'Dehradun', 'Deoghar', 'Dewas', 'Dhanbad', 'Dhamtari',
    'Dhaulagiri', 'Dhaulpur', 'Dharan', 'Dhule', 'Durgapur', 'Eluru', 'Erode', 'Faridabad', 'Faridkot', 'Firozpur',
    'Fukuoka', 'Gandhinagar', 'Gangtok', 'Gaya', 'Gelephu', 'Ghaziabad', 'Giridih', 'Godhra', 'Gonda', 'Gorakhpur',
    'Greatest Noida', 'Gudivada', 'Gulmarg', 'Guna', 'Guntur', 'Guwahati', 'Gwalior', 'Habra', 'Haldia', 'Harare',
    'Haridwar', 'Hazaribagh', 'Hindupur', 'Hiroshima', 'Hisar', 'Hooghly', 'Hospet', 'Howrah', 'Hubli–Dharwad',
    'Hugli-Chuchura', 'Hyderabad', 'Imphal', 'Indore', 'Itanagar', 'Jabalpur', 'Jagtial', 'Jaisalmer', 'Jakar',
    'Jalandhar', 'Jalgaon', 'Jalpaiguri', 'Jammu', 'Jamnagar', 'Janakpur', 'Jaipur', 'Jhansi', 'Jodhpur', 'Jos', 'Kadapa',
    'Kaduna', 'Kaithal', 'Kalaburagi', 'Kalyan-Dombivli', 'Kamarhati', 'Kanpur', 'Kano', 'Kannur', 'Karimnagar',
    'Karnal', 'Katra', 'Kawasaki', 'Khammam', 'Kinshasa', 'Kitakyushu', 'Kobe', 'Kochi', 'Kohima', 'Kolkata',
    'Kollam', 'Korba', 'Kota', 'Kothagudem', 'Kottayam', 'Kozhikode', 'Krishnanagar', 'Kurnool', 'Kyoto', 'Ladakh',
    'Lagos', 'Latur', 'Lucknow', 'Ludhiana', 'Machilipatnam', 'Madanapalle', 'Madhubani', 'Madurai', 'Mahabubnagar',
    'Maiduguri', 'Malda', 'Malegaon', 'Mancherial', 'Mangalagiri-Tadepalli', 'Mangaluru', 'Manjeri', 'Mathura',
    'Meerut', 'Mohali', 'Moradabad', 'Mumbai', 'Munger', 'Mussoorie', 'Muzaffarpur', 'Mysuru', 'Nadia', 'Nagoya', 'Nagpur',
    'Nalgonda', 'Nandyal', 'Nandurbar', 'Narasaraopet', 'Nashik', 'Navsari', 'Navi Mumbai', 'Nellore', 'Nganglam',
    'Nizamabad', 'Nnewi', 'Noida', 'Ongole', 'Onitsha', 'Orai', 'Osaka', 'Owerri', 'Pahalgam', 'Palakkad', 'Palwal',
    'Panvel', 'Paro', 'Patiala', 'patna', 'Phuntsholing', 'Phusro–Bermo–Bokaro Thermal', 'Pimpri-Chinchwad',
    'Prayagraj', 'Proddatur', 'Puducherry', 'Pune', 'Punakha', 'Purnia', 'Puri', 'Raebareli', 'Raichur', 'Raigarh',
    'Rajamahendravaram', 'Rajkot', 'Rajpura', 'Ramagundam', 'ranchi', 'Ratlam', 'Rewa', 'Rishikesh', 'Rohtak',
    'Roorkee', 'Rourkela', 'Rudrapur', 'Sagar', 'Saharanpur', 'Saitama', 'Salem', 'Samastipur', 'Samdrup Jongkhar',
    'Sambalpur', 'Samtse', 'Sangli', 'Sapporo', 'Sasaram', 'Satara', 'Satna', 'Sendai', 'Shamli', 'Shilong',
    'Siddipet', 'Sikar', 'Siliguri', 'Sokoto', 'Sonamarg', 'Sonepat', 'Srikakulam', 'Srinagar', 'Sultanpur',
    'Surat', 'Tadipatri', 'Tawang', 'Tenali', 'Thane', 'Thanjavur', 'Thimphu', 'Thiruvananthapuram', 'Thrissur',
    'Tiruchirappalli', 'Tirunelveli', 'Tirupati', 'Tumkur', 'Udaipur', 'Udupi', 'Ujjain', 'Ulhasnagar', 'Unnao',
    'Uyo', 'Vadodara', 'Varanasi', 'Vasai-Virar', 'Vellore', 'Vijayawada', 'vizag', 'Vizianagaram', 'Vrindavan',
    'Wangdue Phodrang', 'Warangal', 'West Rand', 'Yokohama', 'Zaria'
  ];

  const startPoints = ['Airport', 'Railway Station', 'Bus Stand', 'College Gate'];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    if (trips.length > 0) {
      checkForMatches(trips[trips.length - 1]);
    }
  }, [trips]);

  const checkForMatches = (newTrip) => {
    const matches = trips.filter(trip =>
      trip.id !== newTrip.id &&
      trip.destination === newTrip.destination &&
      trip.startPoint === newTrip.startPoint &&
      trip.date === newTrip.date &&
      Math.abs(parseInt(trip.time.split(':')[0]) - parseInt(newTrip.time.split(':')[0])) <= 1
    );

    if (matches.length > 0) {
      const newNotifications = matches.map(match => ({
        id: Date.now() + Math.random(),
        message: `Match found! ${match.destination} from ${match.startPoint} on ${match.date}`,
        contact: match.contact,
        time: new Date().toLocaleTimeString()
      }));
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  };

  const handleSubmit = () => {
    if (!formData.destination || !formData.startPoint || !formData.date || !formData.time || !formData.contact) {
      alert('Please fill all fields');
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const newTrip = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    setTrips([...trips, newTrip]);
    setFormData({ destination: '', startPoint: '', date: '', time: '', contact: '' });
    setSearchTerm('');
    setView('home');
    alert('Trip registered successfully!');
  };

  const filteredTrips = trips.filter(trip => {
    if (searchFilters.destination && trip.destination !== searchFilters.destination) return false;
    if (searchFilters.startPoint && trip.startPoint !== searchFilters.startPoint) return false;
    if (searchFilters.date && trip.date !== searchFilters.date) return false;
    return true;
  });

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  return (
    <WavyBackground
      className="app-wrapper"
      containerClassName="app-container"
      colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
      waveWidth={50}
      backgroundFill="#000000"
      blur={10}
      speed="slow"
      waveOpacity={0.5}
    >
      {/* Header */}
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-section" onClick={() => setView('home')}>
            <div className="logo-icon">
              <Users size={24} />
            </div>
            <div className="logo-text">
              <h1>TravelBuddy</h1>
              <span>Find your travel companion</span>
            </div>
          </div>

          <nav className="nav-links">
            <button
              onClick={() => setView('home')}
              className={`nav-link ${view === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setView('register')}
              className={`nav-link ${view === 'register' ? 'active' : ''}`}
            >
              <Plus size={16} />
              Register
            </button>
            <button
              onClick={() => setView('search')}
              className={`nav-link ${view === 'search' ? 'active' : ''}`}
            >
              <Search size={16} />
              Search
            </button>
          </nav>

          <div className="header-actions">
            {currentUser ? (
              <div className="user-dropdown">
                <button
                  className="user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>{currentUser.displayName || 'User'}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <button
                      className="user-dropdown-item"
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowUserMenu(false);
                      }}
                    >
                      <User size={16} />
                      View Profile
                    </button>
                    <button
                      className="user-dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="login-btn"
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn size={16} />
                Sign In
              </button>
            )}

            <button
              className="notification-btn"
              onClick={() => setView('notifications')}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Home View */}
        {view === 'home' && (
          <div className="home-view">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content animate-fade-in-up">
                <div className="hero-badge">
                  <Sparkles size={14} />
                  <span>Smart Travel Matching</span>
                </div>
                <h1 className="hero-title">
                  Travel together.
                  <br />
                  <span className="text-gradient">Save together.</span>
                </h1>
                <p className="hero-tagline">
                  Build trusted travel connections & memories
                </p>
                <p className="hero-subtitle">
                  Connect with fellow travelers heading to the same destination.
                  Share rides, split costs, and make new friends along the way.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => setView('register')}>
                    Register Trip
                    <ArrowRight size={18} />
                  </button>
                  <button className="btn-secondary" onClick={() => setView('search')}>
                    Find Companions
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section with Animated Gradient Glow */}
            <section className="features-section">
              <div className="features-grid">
                <BackgroundGradient className="feature-card-inner" containerClassName="feature-card-container animate-fade-in-up delay-100">
                  <div className="feature-icon destination-icon">
                    <MapPin size={28} />
                  </div>
                  <h3>Same Destination</h3>
                  <p>Match with travelers heading to your exact destination city</p>
                </BackgroundGradient>

                <BackgroundGradient className="feature-card-inner" containerClassName="feature-card-container animate-fade-in-up delay-200">
                  <div className="feature-icon time-icon">
                    <Clock size={28} />
                  </div>
                  <h3>Perfect Timing</h3>
                  <p>Find companions departing within your preferred time window</p>
                </BackgroundGradient>

                <BackgroundGradient className="feature-card-inner" containerClassName="feature-card-container animate-fade-in-up delay-300">
                  <div className="feature-icon connect-icon">
                    <Phone size={28} />
                  </div>
                  <h3>Instant Connect</h3>
                  <p>Get notified immediately when a match is found</p>
                </BackgroundGradient>
              </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{trips.length}</span>
                  <span className="stat-label">Active Trips</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-number">{destinations.length}+</span>
                  <span className="stat-label">Destinations</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-number">{notifications.length}</span>
                  <span className="stat-label">Matches Found</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Register View */}
        {view === 'register' && (
          <div className="register-view animate-fade-in">
            <div className="form-container glass-card">
              <div className="form-header">
                <h2>Register Your Trip</h2>
                <p>Share your travel plans and find companions</p>
              </div>

              <div className="form-body">
                {/* Destination Search */}
                <div className="form-group">
                  <label>Destination</label>
                  <div className="search-input-container">
                    <Navigation size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Search destination..."
                      value={searchTerm || formData.destination}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setFormData({ ...formData, destination: e.target.value });
                        setIsDropdownOpen(true);
                      }}
                    />
                    {isDropdownOpen && (
                      <div className="dropdown-menu">
                        {destinations
                          .filter(d => d.toLowerCase().includes((searchTerm || '').toLowerCase()))
                          .slice(0, 8)
                          .map(dest => (
                            <div
                              key={dest}
                              className="dropdown-item"
                              onClick={() => {
                                setFormData({ ...formData, destination: dest });
                                setSearchTerm(dest);
                                setIsDropdownOpen(false);
                              }}
                            >
                              <MapPin size={14} />
                              {dest}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Starting Point */}
                <div className="form-group">
                  <label>Starting Point</label>
                  <select
                    value={formData.startPoint}
                    onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                  >
                    <option value="">Select starting point</option>
                    {startPoints.map(point => (
                      <option key={point} value={point}>{point}</option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contact}
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>

                <button className="submit-btn" onClick={handleSubmit}>
                  <Sparkles size={18} />
                  Register Trip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search View - Interactive Globe */}
        {view === 'search' && (
          <InteractiveGlobe
            trips={trips}
            destinations={destinations}
            onRegisterTrip={(destination) => {
              setFormData({ ...formData, destination });
              setSearchTerm(destination);
              setView('register');
            }}
          />
        )}

        {/* Notifications View */}
        {view === 'notifications' && (
          <div className="notifications-view animate-fade-in">
            <div className="section-header">
              <h2>Notifications</h2>
              <p>Your travel matches and updates</p>
            </div>

            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-state glass-card">
                  <Bell size={48} />
                  <h3>No notifications yet</h3>
                  <p>When someone matches your trip, you'll be notified here</p>
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <div
                    key={notif.id}
                    className="notification-card glass-card animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="notification-content">
                      <div className="notification-icon">
                        <Sparkles size={20} />
                      </div>
                      <div className="notification-text">
                        <p className="notification-message">{notif.message}</p>
                        <p className="notification-contact">
                          <Phone size={14} />
                          Contact: {notif.contact}
                        </p>
                      </div>
                    </div>
                    <button
                      className="notification-dismiss"
                      onClick={() => removeNotification(notif.id)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 TravelBuddy. Travel smarter, together.</p>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthPage
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfilePage
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </WavyBackground>
  );
}