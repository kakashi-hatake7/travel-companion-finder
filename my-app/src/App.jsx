import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Clock, Phone, Search, Bell, Plus, X, Sparkles, ArrowRight, Navigation, LogIn, LogOut, User, Send } from 'lucide-react';
import { WavyBackground } from './components/ui/wavy-background';
import { BackgroundGradient } from './components/ui/background-gradient';
import ModernTimePicker from './components/ui/ModernTimePicker';
import UniGoLogo from './components/ui/UniGoLogo';
import { ToastContainer, useToast } from './components/ui/Toast';
import MobileBottomNav from './components/ui/MobileBottomNav';
import MobileMenu from './components/ui/MobileMenu';
import AuthPage from './components/auth/AuthPage';
import ProfilePage from './components/profile/ProfilePage';
import GoogleEarthGlobe from './components/globe/LeafletGlobe';
import FindCompanion from './components/FindCompanion';
import MyTrip from './components/MyTrip';
import LoadingButton from './components/ui/LoadingButton';
import ConfirmationModal from './components/ui/ConfirmationModal';
import FormInput from './components/ui/FormInput';
import EmptyState from './components/ui/EmptyState';
import GenderPreference from './components/ui/GenderPreference';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { ensureUserProfile } from './services/userService';
import { createTrip, listenToTrips, updateTrip } from './services/tripService';
import { processNewTripMatches } from './services/matchingService';
import { listenToNotifications, deleteNotification } from './services/notificationService';
import { setUserContext, addBreadcrumb } from './services/monitoring';
import './App.css';
import './components/ui/visual-polish.css';

export default function TravelCompanionFinder() {
  const [view, setView] = useState('home');
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    startPoint: '',
    date: '',
    time: '',
    contact: '',
    genderPreference: 'any'
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
  const [editingTripId, setEditingTripId] = useState(null);

  // Mobile navigation state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Loading states for buttons
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ title: '', message: '', matchCount: 0 });

  // Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    destination: '',
    startPoint: '',
    date: '',
    time: '',
    contact: '',
    genderPreference: ''
  });
  const [touchedFields, setTouchedFields] = useState({});

  // Smart autocomplete state
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedContact, setSavedContact] = useState('');
  const popularDestinations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Jaipur'];
  const timePresets = [
    { label: '6 AM', time: '06:00', icon: '🌅' },
    { label: '9 AM', time: '09:00', icon: '☀️' },
    { label: '2 PM', time: '14:00', icon: '🌤️' },
    { label: '6 PM', time: '18:00', icon: '🌆' },
    { label: '9 PM', time: '21:00', icon: '🌙' }
  ];

  const destinations = [
    'Abohar', 'Abuja', 'Adoni', 'Agartala', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola',
    'Aligarh', 'Alwar', 'Amreli', 'Amritsar', 'Amsterdam', 'Anantapuram', 'Andaman & Nicobar Islands',
    'Asansol', 'Athens', 'Aurangabad', 'Ayodhya', 'Azamgarh', 'Ballari', 'Ballia', 'Balasore', 'Bangalore',
    'Bansberia', 'Bareilly', 'Baripada', 'Barcelona', 'Bathinda', 'Beijing', 'Belagavi', 'Benin City',
    'Berhampur', 'Bhadrak', 'Bhagalpur', 'Bharatpur', 'Bhavnagar', 'Bhilai', 'Bhiwadi', 'Bhiwani',
    'Bhopal', 'Bhubaneswar', 'Bhuj', 'Bhusawal', 'Bidar', 'Bilaspur', 'Biratnagar', 'Birgunj', 'Bogotá',
    'Brussels', 'Buenos Aires', 'Butwal', 'Cairo', 'Cape Town', 'Casablanca', 'Chandigarh', 'Chandrapur',
    'Chhapra', 'Chennai', 'Chicago', 'Chirkunda', 'Chittoor', 'Coimbatore', 'Copenhagen', 'Cuttack',
    'Dadra & Nagar Haveli', 'Daman & Diu', 'Dallas', 'Darbhanga', 'Darjeeling', 'Davanagere',
    'Dehradun', 'Deoghar', 'Delhi', 'Dhanbad', 'Dhamtari', 'Dharan', 'Dhule', 'Dubai', 'Dublin',
    'Edinburgh', 'Eluru', 'Faridkot', 'Firozpur', 'Fukuoka', 'Gangtok', 'Gaya', 'Gelephu', 'Geneva',
    'Godhra', 'Gonda', 'Gorakhpur', 'Gudivada', 'Gulmarg', 'Guna', 'Guntur', 'Guwahati', 'Gwalior',
    'Hamburg', 'Harare', 'Haridwar', 'Helsinki', 'Hindupur', 'Hiroshima', 'Hong Kong', 'Hospet',
    'Hubli–Dharwad', 'Hyderabad', 'Imphal', 'Indore', 'Itanagar', 'Istanbul', 'Jakarta', 'Jabalpur',
    'Jagtial', 'Jaisalmer', 'Jakar', 'Jalandhar', 'Jalgaon', 'Jalpaiguri', 'Jammu', 'Jamnagar',
    'Janakpur', 'Jaipur', 'Jerusalem', 'Jhansi', 'Jodhpur', 'Johannesburg', 'Jos', 'Kadapa',
    'Kaduna', 'Kaithal', 'Kalaburagi', 'Kanpur', 'Kano', 'Kannur', 'Karimnagar', 'Karnal', 'Katra',
    'Khammam', 'Kinshasa', 'Kochi', 'Kohima', 'Kolkata', 'Kollam', 'Korba', 'Kota', 'Kothagudem',
    'Kottayam', 'Kozhikode', 'Kuala Lumpur', 'Kurnool', 'Kyiv', 'Ladakh', 'Lagos', 'Latur', 'Lisbon',
    'London', 'Los Angeles', 'Lucknow', 'Ludhiana', 'Madrid', 'Maiduguri', 'Malda', 'Mancherial',
    'Manila', 'Mathura', 'Melbourne', 'Meerut', 'Mexico City', 'Milan', 'Mohali', 'Moradabad',
    'Moscow', 'Mumbai', 'Munger', 'Munich', 'Mussoorie', 'Muzaffarpur', 'Mysuru', 'Nagoya', 'Nagpur',
    'Nairobi', 'Nalgonda', 'Nandyal', 'Nandurbar', 'Narasaraopet', 'Nashik', 'Nellore', 'New York',
    'Nizamabad', 'Ongole', 'Onitsha', 'Osaka', 'Ottawa', 'Owerri', 'Pahalgam', 'Paris', 'Patiala',
    'Patna', 'Perth', 'Phuntsholing', 'Prague', 'Prayagraj', 'Proddatur', 'Puducherry', 'Pune',
    'Punakha', 'Purnia', 'Puri', 'Raebareli', 'Raichur', 'Raigarh', 'Rajamahendravaram', 'Rajkot',
    'Rajpura', 'Ramagundam', 'Ranchi', 'Ratlam', 'Rewa', 'Reykjavík', 'Rishikesh', 'Rome', 'Roorkee',
    'Rourkela', 'Rudrapur', 'Sagar', 'Saharanpur', 'Salem', 'Samastipur', 'Samdrup Jongkhar',
    'Sambalpur', 'Samtse', 'Sangli', 'Santiago', 'Sapporo', 'Sasaram', 'Satara', 'Satna', 'Sendai',
    'Seoul', 'Shanghai', 'Shamli', 'Shillong', 'Siddipet', 'Sikar', 'Siliguri', 'Singapore',
    'Sokoto', 'Sonamarg', 'Srikakulam', 'Srinagar', 'Stockholm', 'Sultanpur', 'Surat', 'Sydney',
    'Tadipatri', 'Tawang', 'Tenali', 'Thanjavur', 'Thimphu', 'Thiruvananthapuram', 'Thrissur',
    'Tokyo', 'Toronto', 'Tiruchirappalli', 'Tirunelveli', 'Tirupati', 'Tumkur', 'Udaipur', 'Udupi',
    'Uyo', 'Vadodara', 'Vancouver', 'Varanasi', 'Vellore', 'Vienna', 'Vijayawada', 'Vizag',
    'Vrindavan', 'Warsaw', 'Washington DC', 'West Rand', 'Yokohama', 'Zurich'

  ];

  const startPoints = ['Airport', 'Railway Station', 'Bus Stand', 'College Gate'];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) setRecentSearches(JSON.parse(stored));
      const contact = localStorage.getItem('savedContact');
      if (contact) setSavedContact(contact);
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }, []);

  // Listen for auth state changes and ensure user profile exists
  useEffect(() => {
    // Handle redirect result from Google Sign-In
    const handleRedirectResult = async () => {
      try {
        const { getRedirectResult } = await import('firebase/auth');
        const result = await getRedirectResult(auth);

        if (result) {
          // User successfully signed in via redirect
          addToast('✅ Successfully signed in with Google!', 'success', 3000);
          addBreadcrumb('Google sign-in successful', 'auth', { userId: result.user.uid });
        }
      } catch (error) {
        if (error.code && error.code !== 'auth/popup-closed-by-user') {
          console.error('Redirect result error:', error);
          addToast('❌ Google sign-in failed. Please try again.', 'error', 5000);
          addBreadcrumb('Google sign-in failed', 'auth', { error: error.message });
        }
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // Set user context for Sentry error tracking
      setUserContext(user);

      if (user) {
        // Ensure user profile exists in Firestore
        await ensureUserProfile(user);
        addBreadcrumb('User logged in', 'auth', { userId: user.uid });
      } else {
        addBreadcrumb('User logged out', 'auth');
      }
    });
    return () => unsubscribe();
  }, []);

  // Ref for dropdown click-outside detection
  const dropdownRef = useRef(null);
  const notificationsInitialized = useRef(false);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Listen to real-time trip updates from Firestore
  useEffect(() => {
    if (!currentUser) {
      setTrips([]); // Clear trips when logged out
      return;
    }

    // Set up real-time listener for all active trips
    const unsubscribe = listenToTrips((updatedTrips) => {
      setTrips(updatedTrips);
    });

    return () => unsubscribe();
  }, [currentUser, addToast]);

  // Listen to real-time notifications for current user
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      notificationsInitialized.current = false;
      return;
    }

    const unsubscribe = listenToNotifications(currentUser.uid, ({ notifications: nextNotifications, changes }) => {
      setNotifications(nextNotifications);

      if (notificationsInitialized.current) {
        const added = changes.filter(change => change.type === 'added');
        added.forEach(change => {
          addToast(`🔔 ${change.title || 'New notification'}`, 'info', 5000);
        });
      } else {
        notificationsInitialized.current = true;
      }
    });

    return () => {
      notificationsInitialized.current = false;
      unsubscribe();
    };
  }, [currentUser]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const unreadNotifications = notifications.filter((notif) => !notif.read);
  const matchFoundCount = notifications.filter((notif) => notif.type === 'match_found').length;

  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Form validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'destination':
        if (!value || value.trim().length === 0) {
          return 'Destination is required';
        }
        if (value.trim().length < 2) {
          return 'Destination must be at least 2 characters';
        }
        return '';

      case 'startPoint':
        if (!value || value.trim().length === 0) {
          return 'Starting point is required';
        }
        return '';

      case 'date':
        if (!value) {
          return 'Travel date is required';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return 'Travel date must be today or in the future';
        }
        return '';

      case 'time':
        if (!value) {
          return 'Departure time is required';
        }
        return '';

      case 'contact':
        if (!value || value.trim().length === 0) {
          return 'Contact number is required';
        }
        if (!/^[0-9]{10}$/.test(value)) {
          return 'Please enter a valid 10-digit mobile number';
        }
        return '';

      case 'genderPreference':
        if (!value) {
          return 'Please select your travel preference';
        }
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {
      destination: validateField('destination', formData.destination),
      startPoint: validateField('startPoint', formData.startPoint),
      date: validateField('date', formData.date),
      time: validateField('time', formData.time),
      contact: validateField('contact', formData.contact),
      genderPreference: validateField('genderPreference', formData.genderPreference)
    };

    setFormErrors(errors);

    // Check if any errors exist
    return !Object.values(errors).some(error => error !== '');
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName]);
    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Clear error when user starts typing
    if (touchedFields[fieldName]) {
      const error = validateField(fieldName, value);
      setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!currentUser) {
      addToast('⚠️ Please sign in to register a trip', 'warning', 4000);
      setShowAuthModal(true);
      return;
    }

    // Mark all fields as touched
    setTouchedFields({
      destination: true,
      startPoint: true,
      date: true,
      time: true,
      contact: true,
      genderPreference: true
    });

    // Validate form
    if (!validateForm()) {
      addToast('❌ Please fix the errors in the form', 'error', 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      // If editing existing trip, update it
      if (editingTripId) {
        const result = await updateTrip(editingTripId, formData);
        if (result.success) {
          addToast('✅ Trip updated successfully!', 'success', 4000);
          setFormData({ destination: '', startPoint: '', date: '', time: '', contact: '', genderPreference: 'any' });
          setSearchTerm('');
          setEditingTripId(null);
          setFormErrors({ destination: '', startPoint: '', date: '', time: '', contact: '', genderPreference: '' });
          setTouchedFields({});
          setView('myTrip');
        } else {
          addToast('❌ Failed to update trip. Please try again.', 'error', 5000);
        }
      } else {
        // Create new trip in Firestore
        const result = await createTrip(
          formData,
          currentUser.uid,
          currentUser.displayName || 'Anonymous',
          currentUser.email || ''
        );

        if (result.success) {
          // Process matches for the new trip
          const matchResult = await processNewTripMatches({
            id: result.tripId,
            ...formData,
            userId: currentUser.uid,
            userDisplayName: currentUser.displayName || 'Anonymous',
            userEmail: currentUser.email || '',
          });

          // Show confirmation modal instead of just a toast
          if (matchResult.matchCount > 0) {
            setConfirmationData({
              title: '🎉 Trip Registered Successfully!',
              message: `Your journey to ${formData.destination} has been registered. We found ${matchResult.matchCount} potential travel companion${matchResult.matchCount > 1 ? 's' : ''}!`,
              matchCount: matchResult.matchCount
            });
            addToast(`🎉 ${matchResult.matchCount} match${matchResult.matchCount > 1 ? 'es' : ''} found! Check your trip details.`, 'success', 5000);
          } else {
            setConfirmationData({
              title: '✅ Trip Registered Successfully!',
              message: `Your journey to ${formData.destination} has been registered. We're actively searching for compatible travel companions.`,
              matchCount: 0
            });
            addToast('✅ Trip registered! We\'ll notify you when we find a match.', 'success', 4000);
          }
          setShowConfirmationModal(true);

          // Save contact and destination for future autofill
          localStorage.setItem('savedContact', formData.contact);
          setSavedContact(formData.contact);
          const updatedSearches = [formData.destination, ...recentSearches.filter(d => d !== formData.destination)].slice(0, 5);
          setRecentSearches(updatedSearches);
          localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

          // Reset form
          setFormData({ destination: '', startPoint: '', date: '', time: '', contact: '', genderPreference: 'any' });
          setSearchTerm('');
          setFormErrors({ destination: '', startPoint: '', date: '', time: '', contact: '', genderPreference: '' });
          setTouchedFields({});
          setView('myTrip');
        } else {
          addToast('❌ Failed to register trip. Please try again.', 'error', 5000);
        }
      }
    } catch (error) {
      console.error('Error submitting trip:', error);
      addToast(editingTripId ? '❌ Failed to update trip. Please try again.' : '❌ Failed to register trip. Please try again.', 'error', 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick selection helpers
  const handleQuickDestination = (dest) => {
    setFormData({ ...formData, destination: dest });
    setSearchTerm(dest);
    setIsDropdownOpen(false);
    // Update recent searches
    const updated = [dest, ...recentSearches.filter(d => d !== dest)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleQuickDate = (type) => {
    const today = new Date();
    let target = new Date();
    if (type === 'tomorrow') target.setDate(today.getDate() + 1);
    else if (type === 'weekend') {
      const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
      target.setDate(today.getDate() + daysUntilSat);
    }
    setFormData({ ...formData, date: target.toISOString().split('T')[0] });
  };

  const handleTimePreset = (time) => {
    setFormData({ ...formData, time });
  };

  const handleContactAutofill = () => {
    if (savedContact) setFormData({ ...formData, contact: savedContact });
  };

  const filteredTrips = trips.filter(trip => {
    if (searchFilters.destination && trip.destination !== searchFilters.destination) return false;
    if (searchFilters.startPoint && trip.startPoint !== searchFilters.startPoint) return false;
    if (searchFilters.date && trip.date !== searchFilters.date) return false;
    return true;
  });

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Error removing notification:', error);
      addToast('Failed to remove notification', 'error', 4000);
    }
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
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-section" onClick={() => setView('home')}>
            <UniGoLogo size={40} showText={false} />
            <div className="logo-text">
              <h1>UniGo</h1>
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
              onClick={() => setView('myTrip')}
              className={`nav-link ${view === 'myTrip' ? 'active' : ''}`}
            >
              <Navigation size={16} />
              My Trip
            </button>
            <button
              onClick={() => setView('search')}
              className={`nav-link ${view === 'search' ? 'active' : ''}`}
            >
              <Search size={16} />
              Globe
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
              {unreadNotifications.length > 0 && (
                <span className="notification-badge">{unreadNotifications.length}</span>
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
              <div className="hero-content">
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
                  <button className="btn-secondary" onClick={() => setView('findCompanion')}>
                    Find Companions
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section with Animated Gradient Glow */}
            <section className="features-section">
              <div className="features-grid">
                <BackgroundGradient className="feature-card-inner" containerClassName="feature-card-container">
                  <div className="feature-icon destination-icon">
                    <MapPin size={32} />
                  </div>
                  <h3>Same Destination</h3>
                  <p>Match with travelers heading to your exact destination city</p>
                </BackgroundGradient>

                <BackgroundGradient className="feature-card-inner" containerClassName="feature-card-container">
                  <div className="feature-icon time-icon">
                    <Clock size={32} />
                  </div>
                  <h3>Perfect Timing</h3>
                  <p>Find companions departing within your preferred time window</p>
                </BackgroundGradient>

                <BackgroundGradient className="feature-card-inner" containerClassName="feature-card-container">
                  <div className="feature-icon connect-icon">
                    <Phone size={32} />
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
                  <span className="stat-number">{matchFoundCount}</span>
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
                <h2>{editingTripId ? 'Edit Your Trip' : 'Register Your Trip'}</h2>
                <p>{editingTripId ? 'Update your travel plans' : 'Share your travel plans and find companions'}</p>
              </div>

              <div className="form-body">
                {/* Destination Search */}
                <div className="form-group">
                  <label>Destination</label>

                  {/* Quick Destination Chips */}
                  <div className="quick-chips-section">
                    {recentSearches.length > 0 && (
                      <div className="quick-chips-row">
                        <span className="quick-label">Recent</span>
                        <div className="quick-chips">
                          {recentSearches.slice(0, 3).map(dest => (
                            <button
                              key={dest}
                              type="button"
                              className={`quick-chip ${formData.destination === dest ? 'active' : ''}`}
                              onClick={() => handleQuickDestination(dest)}
                            >
                              {dest}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="quick-chips-row">
                      <span className="quick-label">Popular</span>
                      <div className="quick-chips">
                        {popularDestinations.slice(0, 4).map(dest => (
                          <button
                            key={dest}
                            type="button"
                            className={`quick-chip ${formData.destination === dest ? 'active' : ''}`}
                            onClick={() => handleQuickDestination(dest)}
                          >
                            {dest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="search-input-container" ref={dropdownRef}>
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
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsDropdownOpen(false);
                        }
                      }}
                    />
                    {isDropdownOpen && (() => {
                      const filteredDests = destinations
                        .filter(d => d.toLowerCase().includes((searchTerm || '').toLowerCase()))
                        .slice(0, 6);

                      return (
                        <div className="dropdown-menu">
                          {filteredDests.length > 0 ? (
                            filteredDests.map(dest => (
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
                            ))
                          ) : (
                            <div className="dropdown-item dropdown-empty">
                              <MapPin size={14} />
                              No destinations found
                            </div>
                          )}
                        </div>
                      );
                    })()}
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
                    {/* Date Quick Picks */}
                    <div className="quick-date-buttons">
                      <button type="button" className="quick-date-btn" onClick={() => handleQuickDate('today')}>Today</button>
                      <button type="button" className="quick-date-btn" onClick={() => handleQuickDate('tomorrow')}>Tomorrow</button>
                      <button type="button" className="quick-date-btn" onClick={() => handleQuickDate('weekend')}>Weekend</button>
                    </div>
                    <input
                      type="date"
                      value={formData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    {/* Custom Time Input - under Date */}
                    <div className="custom-time-section">
                      <span className="custom-time-label">Custom time:</span>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="custom-time-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Quick Time</label>
                    {/* Time Presets Grid */}
                    <div className="time-presets-grid">
                      {timePresets.map(preset => (
                        <button
                          key={preset.time}
                          type="button"
                          className={`time-preset-btn ${formData.time === preset.time ? 'active' : ''}`}
                          onClick={() => handleTimePreset(preset.time)}
                        >
                          <span className="time-icon">{preset.icon}</span>
                          <span className="time-label">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="form-group">
                  <FormInput
                    label="Contact Number"
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => handleFieldChange('contact', e.target.value)}
                    onBlur={() => handleFieldBlur('contact')}
                    error={touchedFields.contact ? formErrors.contact : ''}
                    isValid={!formErrors.contact && formData.contact.length === 10}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                  {/* Contact Autofill */}
                  {savedContact && !formData.contact && (
                    <button type="button" className="autofill-btn" onClick={handleContactAutofill}>
                      <Phone size={14} /> Use saved: {savedContact}
                    </button>
                  )}
                </div>

                {/* Gender Preference */}
                <GenderPreference
                  value={formData.genderPreference}
                  onChange={(value) => handleFieldChange('genderPreference', value)}
                  error={touchedFields.genderPreference ? formErrors.genderPreference : ''}
                  required
                />

                <LoadingButton
                  className="submit-btn"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                >
                  <Sparkles size={18} />
                  {editingTripId ? 'Update Trip' : 'Register Trip'}
                </LoadingButton>
              </div>
            </div>
          </div>
        )}

        {/* My Trip View */}
        {view === 'myTrip' && (
          <MyTrip
            currentUser={currentUser}
            trips={trips}
            addToast={addToast}
            onEdit={(trip) => {
              setFormData({
                destination: trip.destination,
                startPoint: trip.startPoint,
                date: trip.date,
                time: trip.time,
                contact: trip.contact,
                genderPreference: trip.genderPreference || 'any'
              });
              setSearchTerm(trip.destination);
              setEditingTripId(trip.id);
              setView('register');
            }}
            onBack={() => setView('register')}
          />
        )}

        {/* Find Companion View */}
        {view === 'findCompanion' && (
          <FindCompanion
            trips={trips}
            destinations={destinations}
            startPoints={startPoints}
            onRegisterTrip={(destination) => {
              if (destination) {
                setFormData({ ...formData, destination });
                setSearchTerm(destination);
              }
              setView('register');
            }}
            setView={setView}
          />
        )}

        {/* Search View - Google Earth Globe */}
        {view === 'search' && (
          <GoogleEarthGlobe
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
                    className={`notification-card glass-card animate-slide-in ${notif.read ? 'notification-read' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="notification-content">
                      <div className={`notification-icon ${notif.type || ''}`}>
                        <Sparkles size={20} />
                      </div>
                      <div className="notification-text">
                        <p className="notification-title">{notif.title || 'Notification'}</p>
                        <p className="notification-message">{notif.message}</p>
                        <div className="notification-meta">
                          <span>{formatNotificationTime(notif.createdAt)}</span>
                          {notif.type === 'match_found' && <span>Open My Trips to choose your companion</span>}
                          {notif.type === 'companion_selected' && <span>Your companion is confirmed</span>}
                        </div>
                        <button
                          className="notification-action-btn"
                          onClick={() => setView('myTrip')}
                        >
                          View My Trips
                        </button>
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

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeView={view}
        onNavigate={(newView) => {
          setView(newView);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        currentUser={currentUser}
        notificationCount={unreadNotifications.length}
        onNavigate={(newView) => setView(newView)}
        onShowProfile={() => setShowProfileModal(true)}
        onShowAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 UniGo. Travel smarter, together.</p>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title={confirmationData.title}
        message={confirmationData.message}
        matchCount={confirmationData.matchCount}
      />
    </WavyBackground>
  );
}
