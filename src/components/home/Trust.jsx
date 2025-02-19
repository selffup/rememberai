import React from 'react';
import { motion } from 'framer-motion';

const Trust = () => (
    <div className="container mx-auto px-6 py-20 border-t border-white/10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-gray-400">Join the growing community of RecallAI users</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 * i }}
                    className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 text-center"
                >
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-2">
                        {['10K+', '95%', '24/7', '4.9★'][i]}
                    </div>
                    <p className="text-gray-400 text-sm">
                        {['Active Users', 'Satisfaction', 'Support', 'App Rating'][i]}
                    </p>
                </motion.div>
            ))}
        </div>
    </div>
);

export default Trust;