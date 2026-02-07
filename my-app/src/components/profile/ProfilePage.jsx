import React, { useState, useEffect } from 'react';
import {
    User, MapPin, GraduationCap, Globe, Heart, MessageCircle,
    Camera, Edit2, Save, X, Mountain, Umbrella, Wallet, Sparkles,
    Instagram, Twitter, Languages
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const TRAVEL_INTERESTS = [
    { id: 'mountains', label: 'Mountains', icon: Mountain },
    { id: 'beaches', label: 'Beaches', icon: Umbrella },
    { id: 'budget', label: 'Budget Travel', icon: Wallet },
    { id: 'luxury', label: 'Luxury', icon: Sparkles },
    { id: 'adventure', label: 'Adventure', icon: Mountain },
    { id: 'cultural', label: 'Cultural', icon: Globe },
    { id: 'roadtrips', label: 'Road Trips', icon: MapPin },
    { id: 'solo', label: 'Solo Travel', icon: User },
];

const LANGUAGES = [
    // International
    'English', 'español (Spanish)', '中国人 (Mandarin)', '한국인 (Korean)', 
    'русский (Russian)', 'Italiano (Italian)',
    // Indian Languages
    'हिन्दी (Hindi)', 'తెలుగు (Telugu)', 'தமிழ் (Tamil)', 'ಕನ್ನಡ (Kannada)', 
    'മലയാളം (Malayalam)', 'ଓଡିଆ (Odia)', 'संस्कृत (Sanskrit)', 'বাংলা (Bengali)', 
    'ತುಳು (Tulu)', 'অসমীয়া (Assamese)', 'मराठी (Marathi)', 'ਪੰਜਾਬੀ (Punjabi)', 
    'ગુજરાતી (Gujarati)',
    // Asian & European
    '日本語 (Japanese)', 'Deutsch (German)', 'français (French)', 
    'عربي (Arabic)', 'اردو (Urdu)'
];

const AVATAR_COLORS = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
    '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'
];

export default function ProfilePage({ currentUser, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: currentUser?.displayName || '',
        avatarColor: AVATAR_COLORS[0],
        age: '',
        school: '',
        city: '',
        country: '',
        interests: [],
        languages: [],
        bio: '',
        instagram: '',
        twitter: ''
    });

    // Load profile from Firestore
    useEffect(() => {
        const loadProfile = async () => {
            if (!currentUser) return;

            try {
                const docRef = doc(db, 'profiles', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile(prev => ({ ...prev, ...docSnap.data() }));
                } else {
                    // Set default values for new profile
                    setProfile(prev => ({
                        ...prev,
                        name: currentUser.displayName || '',
                        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
                    }));
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [currentUser]);

    // Save profile to Firestore
    const handleSave = async () => {
        if (!currentUser) return;

        setSaving(true);
        try {
            const docRef = doc(db, 'profiles', currentUser.uid);
            await setDoc(docRef, {
                ...profile,
                email: currentUser.email,
                updatedAt: new Date().toISOString()
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const toggleInterest = (interestId) => {
        setProfile(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter(i => i !== interestId)
                : [...prev.interests, interestId]
        }));
    };

    const toggleLanguage = (lang) => {
        setProfile(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }));
    };

    if (loading) {
        return (
            <div className="profile-overlay dark:bg-slate-950/80" onClick={onClose}>
                <div className="profile-modal glass-card dark:bg-slate-900 dark:border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                    <div className="profile-loading dark:text-slate-300">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-overlay dark:bg-slate-950/80" onClick={onClose}>
            <div className="profile-modal glass-card dark:bg-slate-900 dark:border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                <button className="profile-close dark:text-slate-400 dark:hover:text-slate-200" onClick={onClose}>×</button>

                {/* Header */}
                <div className="profile-header">
                    <div
                        className="profile-avatar-large"
                        style={{ background: profile.avatarColor }}
                    >
                        {profile.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    {isEditing ? (
                        <input
                            type="text"
                            className="profile-name-input dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                            value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                            placeholder="Your Name"
                        />
                    ) : (
                        <h2 className="profile-name dark:text-slate-100">{profile.name || 'Your Name'}</h2>
                    )}

                    <p className="profile-email dark:text-slate-400">{currentUser?.email}</p>

                    {isEditing && (
                        <div className="avatar-color-picker dark:text-slate-300">
                            <span>Avatar Color:</span>
                            <div className="color-options">
                                {AVATAR_COLORS.map(color => (
                                    <button
                                        key={color}
                                        className={`color-option ${profile.avatarColor === color ? 'selected' : ''}`}
                                        style={{ background: color }}
                                        onClick={() => setProfile({ ...profile, avatarColor: color })}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Content */}
                <div className="profile-content">
                    {/* Basic Info */}
                    <div className="profile-section">
                        <h3 className="dark:text-slate-200"><User size={18} /> Basic Info</h3>
                        <div className="profile-fields">
                            <div className="profile-field">
                                <label className="dark:text-slate-400">Age</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={profile.age}
                                        onChange={e => setProfile({ ...profile, age: e.target.value })}
                                        placeholder="Your age"
                                        min="13"
                                        max="100"
                                        className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                    />
                                ) : (
                                    <span className="dark:text-slate-100">{profile.age || 'Not specified'}</span>
                                )}
                            </div>

                            <div className="profile-field">
                                <label className="dark:text-slate-400"><GraduationCap size={14} /> School/University</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.school}
                                        onChange={e => setProfile({ ...profile, school: e.target.value })}
                                        placeholder="Your school or university"
                                        className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                    />
                                ) : (
                                    <span className="dark:text-slate-100">{profile.school || 'Not specified'}</span>
                                )}
                            </div>

                            <div className="profile-field-row">
                                <div className="profile-field">
                                    <label className="dark:text-slate-400"><MapPin size={14} /> City</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.city}
                                            onChange={e => setProfile({ ...profile, city: e.target.value })}
                                            placeholder="City"
                                            className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                        />
                                    ) : (
                                        <span className="dark:text-slate-100">{profile.city || 'Not specified'}</span>
                                    )}
                                </div>
                                <div className="profile-field">
                                    <label className="dark:text-slate-400"><Globe size={14} /> Country</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.country}
                                            onChange={e => setProfile({ ...profile, country: e.target.value })}
                                            placeholder="Country"
                                            className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                        />
                                    ) : (
                                        <span className="dark:text-slate-100">{profile.country || 'Not specified'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Travel Interests */}
                    <div className="profile-section">
                        <h3 className="dark:text-slate-200"><Heart size={18} /> Travel Interests</h3>
                        <div className="interests-grid">
                            {TRAVEL_INTERESTS.map(interest => {
                                const Icon = interest.icon;
                                const isSelected = profile.interests.includes(interest.id);
                                return (
                                    <button
                                        key={interest.id}
                                        className={`interest-tag dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 ${isSelected ? 'selected dark:bg-blue-600 dark:text-white' : ''}`}
                                        onClick={() => isEditing && toggleInterest(interest.id)}
                                        disabled={!isEditing}
                                    >
                                        <Icon size={14} />
                                        {interest.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="profile-section">
                        <h3 className="dark:text-slate-200"><Languages size={18} /> Languages</h3>
                        <div className="languages-grid">
                            {LANGUAGES.map(lang => {
                                const isSelected = profile.languages.includes(lang);
                                return (
                                    <button
                                        key={lang}
                                        className={`language-tag dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 ${isSelected ? 'selected dark:bg-blue-600 dark:text-white' : ''}`}
                                        onClick={() => isEditing && toggleLanguage(lang)}
                                        disabled={!isEditing}
                                    >
                                        {lang}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="profile-section">
                        <h3 className="dark:text-slate-200"><MessageCircle size={18} /> Bio</h3>
                        {isEditing ? (
                            <textarea
                                className="profile-bio-input dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                value={profile.bio}
                                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell travelers about yourself..."
                                maxLength={300}
                            />
                        ) : (
                            <p className="profile-bio dark:text-slate-300">{profile.bio || 'No bio yet. Add a short intro about yourself!'}</p>
                        )}
                    </div>

                    {/* Social Media */}
                    <div className="profile-section">
                        <h3 className="dark:text-slate-200"><Globe size={18} /> Social Media</h3>
                        <div className="social-fields">
                            <div className="social-field">
                                <Instagram size={18} className="dark:text-slate-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.instagram}
                                        onChange={e => setProfile({ ...profile, instagram: e.target.value })}
                                        placeholder="Instagram username"
                                        className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                    />
                                ) : (
                                    <span className="dark:text-slate-300">{profile.instagram ? `@${profile.instagram}` : 'Not linked'}</span>
                                )}
                            </div>
                            <div className="social-field">
                                <Twitter size={18} className="dark:text-slate-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.twitter}
                                        onChange={e => setProfile({ ...profile, twitter: e.target.value })}
                                        placeholder="Twitter/X username"
                                        className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                    />
                                ) : (
                                    <span className="dark:text-slate-300">{profile.twitter ? `@${profile.twitter}` : 'Not linked'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="btn-secondary dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700" onClick={() => setIsEditing(false)}>
                                <X size={18} />
                                Cancel
                            </button>
                            <button className="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white" onClick={handleSave} disabled={saving}>
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </>
                    ) : (
                        <button className="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
