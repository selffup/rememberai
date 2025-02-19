import React from 'react';
import { motion } from 'framer-motion';

const BrainRoadmap = () => {
    return (
        <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
            <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full max-w-[400px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                <defs>
                    <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>
                
                {/* Left hemisphere */}
                <motion.path
                    d="M100 40 C60 40, 40 60, 40 100 C40 140, 60 160, 100 160
                       C80 140, 70 120, 70 100 C70 80, 80 60, 100 40"
                    fill="url(#brainGradient)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    className="opacity-80"
                />

                {/* Right hemisphere */}
                <motion.path
                    d="M100 40 C140 40, 160 60, 160 100 C160 140, 140 160, 100 160
                       C120 140, 130 120, 130 100 C130 80, 120 60, 100 40"
                    fill="url(#brainGradient)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
                    className="opacity-80"
                />

                {/* Brain details - left */}
                <motion.path
                    d="M85 60 C75 70, 65 85, 65 100 C65 115, 75 130, 85 140"
                    stroke="url(#brainGradient)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                />

                {/* Brain details - right */}
                <motion.path
                    d="M115 60 C125 70, 135 85, 135 100 C135 115, 125 130, 115 140"
                    stroke="url(#brainGradient)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1.5 }}
                />

                {/* Connecting bridge */}
                <motion.path
                    d="M90 100 L110 100"
                    stroke="url(#brainGradient)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                />
            </motion.svg>
        </div>
    );
};

export default BrainRoadmap;