import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await login(email, password);
            if (result?.token) {
                navigate('/chat');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubLogin = () => {
        try {
            // Pass true to indicate this is a login attempt
            window.location.href = authAPI.getGithubAuthUrl(true);
        } catch (error) {
            console.error('GitHub login error:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/chat');
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get('error');
        const message = params.get('message');

        if (error === 'email_exists') {
            setError(message || 'Email already registered with another account');
        } else if (error === 'account_not_found') {
            setError(message || 'No account found. Please sign up first.');
        } else if (error === 'github_auth_failed') {
            setError('GitHub authentication failed');
        } else if (error === 'google_auth_failed') {
            setError('Google authentication failed');
        }

        // Clear the error from URL
        if (error) {
            window.history.replaceState({}, document.title, '/login');
        }
    }, [location]);

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black opacity-40 transform rotate-45 scale-150 translate-x-1/4 translate-y-1/4 animate-wave-slow" />
                <div className="absolute inset-0 bg-gradient-to-l from-black via-gray-800 to-gray-900 opacity-40 transform -rotate-45 scale-150 -translate-x-1/4 -translate-y-1/4 animate-wave-fast" />
            </div>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-2xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-center text-4xl font-bold text-white tracking-tight">
                        RecallAI
                    </h1>
                    <h2 className="mt-6 text-center text-2xl font-bold text-white">
                        Sign in to your account
                    </h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Or{' '}
                        <Link 
                            to="/signup" 
                            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                        >
                            create a new account
                        </Link>
                    </p>
                </motion.div>

                <motion.div className="flex flex-col space-y-4">
                    <button
                        onClick={handleGithubLogin}
                        className="group relative w-full flex justify-center py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <FaGithub className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                        </span>
                        Continue with GitHub
                    </button>

                    <button
                        onClick={handleGoogleLogin}
                        className="group relative w-full flex justify-center py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <FcGoogle className="h-5 w-5" />
                        </span>
                        Continue with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>
                </motion.div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <motion.div>
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`mt-1 block w-full px-3 py-2 bg-white/5 border ${emailError ? 'border-red-500' : 'border-white/10'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    validateEmail(e.target.value);
                                }}
                            />
                            {emailError && <p className="error-text">{emailError}</p>}
                        </motion.div>

                        <motion.div>
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`mt-1 block w-full px-3 py-2 bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/10'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                            />
                            {passwordError && <p className="error-text">{passwordError}</p>}
                        </motion.div>
                    </div>

                    <motion.div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                                Forgot your password?
                            </Link>
                        </div>
                    </motion.div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isLoading ? 'Loading...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}