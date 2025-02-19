import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FindButton from '../components/common/autopilot';

const Events = () => {
    const [stats, setStats] = useState({
        today: 0,
        upcoming: 0,
        total: 0
    });

    useEffect(() => {
        // TODO: Replace with actual API calls
        const fetchStats = async () => {
            // Simulate API call
            const mockStats = {
                today: 3,
                upcoming: 8,
                total: 15
            };
            setStats(mockStats);
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

            <main className="relative isolate px-6 pt-14 lg:px-8 transition-all duration-300 md:ml-[16rem] lg:ml-[16rem] pb-20">
                <div className="mx-auto max-w-7xl py-12 sm:py-16 lg:py-20">
                    <motion.div
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <StatCard
                            title="Today's Events"
                            mainStat={stats.today}
                            subStat="Events happening today"
                            icon={<TodayIcon />}
                            color="indigo"
                        />
                        <StatCard
                            title="Upcoming Events"
                            mainStat={stats.upcoming}
                            subStat="Events in next 7 days"
                            icon={<UpcomingIcon />}
                            color="purple"
                        />
                        <StatCard
                            title="Total Events"
                            mainStat={stats.total}
                            subStat="All scheduled events"
                            icon={<TotalIcon />}
                            color="pink"
                        />
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        className="mt-12 flex flex-wrap justify-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <ActionButton label="Schedule Event" icon={<CalendarIcon />} primary />
                        <ActionButton label="View Calendar" icon={<ViewIcon />} />
                        <ActionButton label="Set Reminder" icon={<BellIcon />} />
                    </motion.div>
                </div>
                <div className="absolute md:bottom-48 md:right-0 bottom-48 right-0 z-50 pb-8">
                    <FindButton />
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ title, mainStat, subStat, icon, color }) => (
    <motion.div
        className="relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-lg border border-white/10 shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl bg-${color}-500/10`}>
                {icon}
            </div>
            <div>
                <h3 className="text-base font-semibold leading-7 text-white">{title}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                    <motion.p
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {mainStat}
                    </motion.p>
                    <span className="text-sm text-gray-400">{subStat}</span>
                </div>
            </div>
        </div>
        <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-${color}-500 via-${color}-400 to-${color}-600`} />
    </motion.div>
);

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
const TodayIcon = () => (
    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const UpcomingIcon = () => (
    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TotalIcon = () => (
    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ViewIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export default Events;