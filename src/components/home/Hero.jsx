import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    const gradientVariants = {
        animate: {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            transition: {
                duration: 10,
                ease: 'linear',
                repeat: Infinity
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-20 text-center relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center mb-8 relative"
            >
                <motion.div
                    className="absolute -inset-20 bg-gradient-to-r from-gray-500/20 via-gray-300/20 to-white/20 blur-3xl"
                    variants={gradientVariants}
                    animate="animate"
                />
                <motion.img
                    src="/logo.svg"
                    alt="RecallAI Logo"
                    className="h-12 w-auto mr-4 relative z-10 filter invert"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                />
                <motion.h1
                    className="text-5xl md:text-6xl font-bold text-white relative z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    Recall<span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-white animate-gradient">AI</span>
                </motion.h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-white mb-12 max-w-2xl mx-auto relative z-10 drop-shadow-lg shadow-black"
            >
                Your AI-powered memory assistant that helps you remember everything important in your life.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 relative z-10"
            >
                <Link
                    to="/signup"
                    className="group relative px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-white/20 transform -skew-x-12"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.7 }}
                    />
                    <span className="relative">Get Started</span>
                </Link>
                <Link
                    to="/about"
                    className="group px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-lg relative overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <span className="relative">Learn More</span>
                </Link>
            </motion.div>

            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 8s ease infinite;
                    background-size: 200% 200%;
                }
            `}</style>
        </div>
    );
};

export default Hero;