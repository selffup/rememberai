import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-8">Terms and Conditions</h1>
                    
                    <div className="space-y-6 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing and using RecallAI, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
                            <p>RecallAI provides AI-powered memory assistance services, including but not limited to note organization, time-based reminders, and secure data storage.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h2>
                            <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
                            <p>All content and functionality on RecallAI, including but not limited to text, graphics, logos, and software, is the property of RecallAI and is protected by intellectual property laws.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
                            <p>RecallAI is provided "as is" without any warranties. We shall not be liable for any damages arising from the use or inability to use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Modifications to Service</h2>
                            <p>We reserve the right to modify or discontinue our service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">7. Governing Law</h2>
                            <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to conflicts of law principles.</p>
                        </section>
                    </div>

                    <p className="mt-8 text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;