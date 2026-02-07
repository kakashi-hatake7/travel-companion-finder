import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthPage({ onClose, onSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Import auth functions dynamically to avoid circular deps
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Dynamic import of auth context
            const { auth } = await import('../../firebase');
            const {
                createUserWithEmailAndPassword,
                signInWithEmailAndPassword,
                updateProfile
            } = await import('firebase/auth');

            if (isLogin) {
                // Login
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                setSuccess('Login successful!');
                setTimeout(() => onSuccess && onSuccess(), 1000);
            } else {
                // Signup validation
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                if (!formData.name.trim()) {
                    throw new Error('Please enter your name');
                }

                // Create account
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                // Update profile with name
                await updateProfile(userCredential.user, {
                    displayName: formData.name
                });

                setSuccess('Account created successfully!');
                setTimeout(() => onSuccess && onSuccess(), 1000);
            }
        } catch (err) {
            // Handle Firebase errors
            let message = err.message;
            if (err.code === 'auth/email-already-in-use') {
                message = 'This email is already registered. Try logging in.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Please enter a valid email address.';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters.';
            } else if (err.code === 'auth/user-not-found') {
                message = 'No account found with this email.';
            } else if (err.code === 'auth/wrong-password') {
                message = 'Incorrect password. Please try again.';
            } else if (err.code === 'auth/invalid-credential') {
                message = 'Invalid email or password.';
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { auth } = await import('../../firebase');
            const { sendPasswordResetEmail } = await import('firebase/auth');
            await sendPasswordResetEmail(auth, formData.email);
            setSuccess('Password reset email sent! Check your inbox.');
        } catch (err) {
            setError('Failed to send reset email. Check your email address.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            const { auth } = await import('../../firebase');
            const { GoogleAuthProvider, signInWithRedirect } = await import('firebase/auth');
            const provider = new GoogleAuthProvider();

            // Use redirect instead of popup to avoid COOP issues
            await signInWithRedirect(auth, provider);
            // Note: The page will redirect, so success callback happens after redirect
        } catch (err) {
            setLoading(false);
            if (err.code === 'auth/popup-blocked') {
                setError('Sign-in blocked. Please allow redirects for this site.');
            } else {
                console.error('Google sign-in error:', err);
                setError('Google sign-in failed. Please try again.');
            }
        }
    };

    return (
        <div className="auth-overlay dark:bg-slate-950/80" onClick={onClose}>
            <div className="auth-modal glass-card dark:bg-slate-900 dark:border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                <button className="auth-close dark:text-slate-400 dark:hover:text-slate-200" onClick={onClose}>×</button>

                <div className="auth-header">
                    <div className="auth-icon dark:bg-blue-500/20 dark:text-blue-400">
                        <Sparkles size={28} />
                    </div>
                    <h2 className="dark:text-slate-100">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="dark:text-slate-400">{isLogin ? 'Sign in to continue your journey' : 'Join UniGo today'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="auth-input-group dark:bg-slate-950 dark:border-slate-700">
                            <User size={18} className="auth-input-icon dark:text-slate-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required={!isLogin}
                                className="dark:text-slate-100 dark:placeholder-slate-500"
                            />
                        </div>
                    )}

                    <div className="auth-input-group dark:bg-slate-950 dark:border-slate-700">
                        <Mail size={18} className="auth-input-icon dark:text-slate-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="dark:text-slate-100 dark:placeholder-slate-500"
                        />
                    </div>

                    <div className="auth-input-group dark:bg-slate-950 dark:border-slate-700">
                        <Lock size={18} className="auth-input-icon dark:text-slate-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="dark:text-slate-100 dark:placeholder-slate-500"
                        />
                        <button
                            type="button"
                            className="auth-password-toggle dark:text-slate-400 dark:hover:text-slate-200"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <div className="auth-input-group dark:bg-slate-950 dark:border-slate-700">
                            <Lock size={18} className="auth-input-icon dark:text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required={!isLogin}
                                className="dark:text-slate-100 dark:placeholder-slate-500"
                            />
                        </div>
                    )}

                    {isLogin && (
                        <button
                            type="button"
                            className="auth-forgot-btn"
                            onClick={handleForgotPassword}
                        >
                            Forgot Password?
                        </button>
                    )}

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-loading">Processing...</span>
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <button
                    type="button"
                    className="auth-google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>

                <div className="auth-switch">
                    <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setSuccess('');
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
}
