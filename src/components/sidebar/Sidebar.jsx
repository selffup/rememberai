import React, { useState } from 'react';
import {
    HomeIcon,
    CalendarIcon,
    DocumentTextIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import FindButton from '../common/autopilot';

const Sidebar = ({ user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: HomeIcon, label: 'Home', path: '/dashboard' },
        { icon: CalendarIcon, label: 'Events', path: '/events' },
        { icon: DocumentTextIcon, label: 'Notes', path: '/notes' },
        { icon: UserCircleIcon, label: 'Account', path: '/account' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col fixed h-screen w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white backdrop-blur-lg border-r border-white/10 z-10 shadow-2xl">
                <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-gray-900 via-gray-800 to-black">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">R</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Recall<span className="text-indigo-400">AI</span></h1>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto relative space-y-4">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
                    <div className="relative z-10 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center space-x-3 text-gray-300 w-full px-4 py-3 rounded-lg transition-colors duration-200
                                    ${location.pathname === item.path ?
                                        'bg-indigo-500/10 text-white border border-indigo-500/20' :
                                        'hover:bg-white/5 hover:text-white border border-transparent'}
                                `}
                            >
                                <div className="min-w-[24px]">
                                    <item.icon className={`h-5 w-5 transition-colors duration-200 ${location.pathname === item.path ? 'text-indigo-400' : 'text-gray-400'}`} />
                                </div>
                                <span className="font-medium text-sm tracking-wide">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* User Section */}
                <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-b from-transparent to-gray-900/50">
                    <div className="mb-4 px-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            Online
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 px-2 py-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe] flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-gradient-to-t from-gray-900 via-gray-800 to-black backdrop-blur-lg border-t border-white/10 px-4 py-2 shadow-2xl">
                    <div className="flex justify-around items-center max-w-md mx-auto relative">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
                        <div className="relative z-10 flex justify-around items-center w-full">
                            {menuItems.map((item) => (
                                <NavItem
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={location.pathname === item.path}
                                    onClick={() => handleNavigation(item.path)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center px-3 py-1 w-full transition-all duration-300"
    >
        <div className={`transition-transform duration-300 ${isActive ? 'scale-105' : ''}`}>
            <Icon
                className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-[#4facfe]' : 'text-gray-400 hover:text-[#4facfe]'}`}
            />
        </div>
        <span className={`text-xs mt-1 transition-colors duration-300 ${isActive ? 'text-[#4facfe]' : 'text-gray-400 hover:text-[#4facfe]'}`}>
            {label}
        </span>
    </button>
);

export default Sidebar;