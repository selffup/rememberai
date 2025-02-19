import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) return;

        setIsLoading(true);
        setError('');

        try {
            await authAPI.forgotPassword(email);
            setSuccess(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
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
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </motion.div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-center">
                        <div className="text-sm font-medium text-red-800">{error}</div>
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="rounded-md bg-green-50 p-4 mb-4">
                            <div className="text-sm font-medium text-green-800">
                                Password reset link has been sent to your email.
                            </div>
                        </div>
                        <Link
                            to="/login"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                        >
                            Return to login
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`mt-1 block w-full px-3 py-2 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending reset link...
                                    </span>
                                ) : (
                                    'Send reset link'
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                            >
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}