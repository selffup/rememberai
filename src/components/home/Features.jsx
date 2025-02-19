import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaRegLightbulb, FaRegClock, FaShieldAlt } from 'react-icons/fa';

const Features = () => {
    const features = [
        {
            icon: <FaBrain className="w-8 h-8 text-gray-300" />,
            title: 'AI-Powered Memory Assistant',
            description: 'Let our advanced AI help you remember important information, events, and tasks with ease.'
        },
        {
            icon: <FaRegLightbulb className="w-8 h-8 text-gray-400" />,
            title: 'Smart Note Organization',
            description: 'Automatically categorize and tag your notes for efficient retrieval when you need them.'
        },
        {
            icon: <FaRegClock className="w-8 h-8 text-gray-300" />,
            title: 'Time-Based Reminders',
            description: 'Never forget important dates or tasks with our intelligent reminder system.'
        },
        {
            icon: <FaShieldAlt className="w-8 h-8 text-gray-400" />,
            title: 'Secure Storage',
            description: 'Your memories are safe with us. End-to-end encryption ensures your data remains private.'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.02,
            rotateY: 5,
            boxShadow: "0 25px 30px -10px rgba(0, 0, 0, 0.3)",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
                <p className="text-gray-400">Everything you need to enhance your memory and productivity</p>
            </motion.div>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover="hover"
                        className="p-8 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black backdrop-blur-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform perspective-1000 relative group overflow-hidden shadow-xl"
                        style={{
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden"
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 via-gray-600/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <motion.div 
                            className="relative z-10 mb-6"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {feature.icon}
                        </motion.div>
                        <h3 className="text-2xl font-semibold text-white mb-4 relative z-10 drop-shadow-lg">{feature.title}</h3>
                        <p className="text-gray-200 relative z-10 drop-shadow-md">{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Features;