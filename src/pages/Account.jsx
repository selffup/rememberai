import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import FindButton from '../components/common/autopilot';

const Account = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

            <main className="relative isolate px-6 pt-14 lg:px-8 transition-all duration-300 md:ml-[16rem] lg:ml-[16rem]">
                <div className="mx-auto max-w-7xl py-12 sm:py-16 lg:py-20">
                    <motion.div
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        {/* Profile Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-lg border border-white/10 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-indigo-500/10">
                                    <UserIcon />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold leading-7 text-white">Profile</h3>
                                    <div className="mt-1">
                                        <p className="text-lg text-white">{user?.username || 'User'}</p>
                                        <p className="text-sm text-gray-400">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-lg border border-white/10 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-purple-500/10">
                                    <SettingsIcon />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold leading-7 text-white">Settings</h3>
                                    <div className="mt-1">
                                        <p className="text-sm text-gray-400">Manage your account preferences</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        className="mt-12 flex flex-wrap justify-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <ActionButton label="Edit Profile" icon={<PencilIcon />} primary />
                        <ActionButton label="Change Password" icon={<KeyIcon />} />
                        <ActionButton label="Privacy Settings" icon={<ShieldIcon />} />
                    </motion.div>
                </div>
                <div className="absolute md:bottom-48 md:right-0 bottom-48 right-0 z-50 pb-8">
                    <FindButton />
                </div>
            </main>
        </div>
    );
};

const ActionButton = ({ label, icon, primary }) => (
    <motion.button
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all
            ${primary ?
                'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' :
                'bg-white/5 text-white hover:bg-white/10'}
            backdrop-blur-lg shadow-lg`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        {icon}
        {label}
    </motion.button>
);

// Icons
const UserIcon = () => (
    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PencilIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const KeyIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

export default Account;