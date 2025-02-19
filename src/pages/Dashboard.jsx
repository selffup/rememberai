import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import FindButton from '../components/common/autopilot';

const Dashboard = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [stats, setStats] = useState({
        tasks: { total: 0, completed: 0 },
        events: { upcoming: 0, total: 0 },
        notes: { recent: 0, total: 0 }
    });

    useEffect(() => {
        // TODO: Replace with actual API calls
        const fetchStats = async () => {
            // Simulate API call
            const mockStats = {
                tasks: { total: 28, completed: 18 },
                events: { upcoming: 5, total: 12 },
                notes: { recent: 8, total: 24 }
            };
            setStats(mockStats);
        };

        fetchStats();
    }, []);

    return (
        <div className={`min-h-screen overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100'}`}>
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black opacity-40 transform rotate-45 scale-150 translate-x-1/4 translate-y-1/4 animate-wave-slow" />
                <div className="absolute inset-0 bg-gradient-to-l from-black via-gray-800 to-gray-900 opacity-40 transform -rotate-45 scale-150 -translate-x-1/4 -translate-y-1/4 animate-wave-fast" />
            </div>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />

            <main className="relative isolate px-6 pt-14 lg:px-8 transition-all duration-300 md:ml-[16rem] lg:ml-[16rem] pb-20">
                <div className="mx-auto max-w-7xl py-12 sm:py-16 lg:py-20">
                    {/* Stats Grid */}
                    <motion.div
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <StatCard
                            title="Tasks"
                            mainStat={`${stats.tasks.completed}/${stats.tasks.total}`}
                            subStat={`${Math.round((stats.tasks.completed / stats.tasks.total) * 100)}% Completed`}
                            icon={<TaskIcon />}
                            color="indigo"
                        />
                        <StatCard
                            title="Upcoming Events"
                            mainStat={stats.events.upcoming}
                            subStat={`${stats.events.total} Total Events`}
                            icon={<EventIcon />}
                            color="purple"
                        />
                        <StatCard
                            title="Recent Notes"
                            mainStat={stats.notes.recent}
                            subStat={`${stats.notes.total} Total Notes`}
                            icon={<NoteIcon />}
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
                        <ActionButton label="Add Task" icon={<PlusIcon />} primary />
                        <ActionButton label="Schedule Event" icon={<CalendarIcon />} />
                        <ActionButton label="Create Note" icon={<PencilIcon />} />
                    </motion.div>

                    {/* FindButton */}

                </div>
                <div className="absolute md:bottom-48 md:right-0 bottom-48 right-0 z-50 pb-8">
                    <FindButton />
                </div>
            </main>

        </div>
    );
};

const StatCard = ({ title, mainStat, subStat, icon, color }) => {
    const { isDarkMode } = useTheme();

    const getColorClass = (color) => {
        const colorMap = {
            indigo: 'bg-indigo-500/10',
            purple: 'bg-purple-500/10',
            pink: 'bg-pink-500/10'
        };
        return colorMap[color] || 'bg-gray-500/10';
    };

    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} p-6 backdrop-blur-lg border shadow-xl`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${getColorClass(color)}`}>
                    {icon}
                </div>
                <div>
                    <h3 className={`text-base font-semibold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    <div className="mt-1 flex items-baseline gap-2">
                        <motion.p
                            className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {mainStat}
                        </motion.p>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subStat}</span>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
        </motion.div>
    );
}
const ActionButton = ({ label, icon, primary }) => {
    const { isDarkMode } = useTheme();

    const getColorClass = (color) => {
        const colorMap = {
            indigo: 'bg-indigo-500/10',
            purple: 'bg-purple-500/10',
            pink: 'bg-pink-500/10'
        };
        return colorMap[color] || 'bg-gray-500/10';
    };

    return (
        <motion.button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all
            ${primary ?
                    'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white' :
                    isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}
            backdrop-blur-lg shadow-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {icon}
            {label}
        </motion.button>
    );
}

// Icons
const TaskIcon = () => (
    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const EventIcon = () => (
    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const NoteIcon = () => (
    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const PencilIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

export default Dashboard;