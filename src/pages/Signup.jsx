import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { signup, loginWithGithub, loginWithGoogle, error } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await signup(username, email, password);
            navigate('/chat');
        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ submit: error.message || 'Failed to create account' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubSignup = () => {
        try {
            window.location.href = authAPI.getGithubAuthUrl(false);
        } catch (error) {
            console.error('GitHub signup error:', error);
            setErrors({ submit: 'Failed to connect with GitHub' });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/chat');
        } catch (error) {
            console.error('Google login error:', error);
            setErrors({ submit: 'Failed to connect with Google' });
        }
    };

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
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Or{' '}
                        <Link 
                            to="/login" 
                            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                        >
                            sign in to your account
                        </Link>
                    </p>
                </motion.div>

                {(error || errors.submit) && (
                    <div className="rounded-md bg-red-50 p-4 text-center">
                        <div className="text-sm font-medium text-red-800">{error || errors.submit}</div>
                    </div>
                )}

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleGithubSignup}
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
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-white">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                
                                className={`mt-1 block w-full px-3 py-2 bg-white/5 border ${errors.username ? 'border-red-500' : 'border-white/10'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                
                                className={`mt-1 block w-full px-3 py-2 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                
                                className={`mt-1 block w-full px-3 py-2 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                
                                className={`mt-1 block w-full px-3 py-2 bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </div>

                    <div className="text-sm text-center text-gray-400">
                        By signing up, you agree to our{' '}
                        <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                            Privacy Policy
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}