import React from 'react';
import { motion } from 'framer-motion';
import { FaQuestion } from 'react-icons/fa';

const FAQ = () => {
    const faqs = [
        {
            question: 'How does RecallAI work?',
            answer: 'RecallAI uses advanced artificial intelligence to analyze and organize your notes, tasks, and memories. It learns from your patterns to provide timely reminders and relevant information when you need them.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes, we use end-to-end encryption and follow industry-best security practices to ensure your data remains private and secure.'
        },
        {
            question: 'Can I use RecallAI offline?',
            answer: 'Yes, RecallAI has offline capabilities. While some features require internet connection, core functionalities work offline.'
        },
        {
            question: 'What platforms are supported?',
            answer: 'RecallAI is available on web, iOS, and Android platforms, with seamless synchronization across all your devices.'
        }
    ];

    return (
        <div className="container mx-auto px-6 py-20 border-t border-white/10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-400">Everything you need to know about RecallAI</p>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 * index }}
                        className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10"
                    >
                        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                            <FaQuestion className="text-indigo-400" />
                            {faq.question}
                        </h3>
                        <p className="text-gray-400">{faq.answer}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;