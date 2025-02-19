import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
                    
                    <div className="space-y-6 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                            <p>We collect information that you provide directly to us, including personal information, notes, and usage data to provide and improve our AI-powered memory assistance services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                            <p>Your information is used to provide personalized memory assistance, organize notes, set reminders, and improve our AI algorithms. We do not sell your personal information to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
                            <p>We implement robust security measures, including encryption and secure data storage, to protect your personal information and notes from unauthorized access or disclosure.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Data Retention</h2>
                            <p>We retain your information for as long as your account is active or as needed to provide services. You can request deletion of your data at any time.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies and Tracking</h2>
                            <p>We use cookies and similar technologies to enhance your experience and collect usage data for improving our services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
                            <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights or ask questions about our privacy practices.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to Privacy Policy</h2>
                            <p>We may update this privacy policy periodically. We will notify you of any material changes by posting the new policy on this page.</p>
                        </section>
                    </div>

                    <p className="mt-8 text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Privacy;