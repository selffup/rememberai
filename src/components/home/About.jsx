import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaLock } from 'react-icons/fa';

const About = () => (
    <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl font-bold text-white mb-8"
            >
                About RecallAI
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-300 mb-12"
            >
                RecallAI was born from a simple idea: to help people remember what matters most. Our AI-powered platform
                combines cutting-edge technology with intuitive design to create the perfect memory assistant.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-black backdrop-blur-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform perspective-1000 relative group overflow-hidden shadow-xl"
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 via-gray-600/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <FaRocket className="w-8 h-8 text-indigo-400 mx-auto mb-4 relative z-10" />
                    <h3 className="text-xl font-semibold text-white mb-2 relative z-10 drop-shadow-lg">Our Mission</h3>
                    <p className="text-gray-200 relative z-10 drop-shadow-md">To enhance human memory and productivity through AI innovation</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-black backdrop-blur-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform perspective-1000 relative group overflow-hidden"
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 via-gray-600/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <FaUsers className="w-8 h-8 text-purple-400 mx-auto mb-4 relative z-10" />
                    <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Our Team</h3>
                    <p className="text-gray-300 relative z-10">Passionate experts in AI, UX, and cognitive science</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-black backdrop-blur-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform perspective-1000 relative group overflow-hidden"
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 via-gray-600/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <FaLock className="w-8 h-8 text-pink-400 mx-auto mb-4 relative z-10" />
                    <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Our Promise</h3>
                    <p className="text-gray-300 relative z-10">Secure, private, and reliable memory enhancement</p>
                </motion.div>
            </div>
        </div>
    </div>
);

export default About;