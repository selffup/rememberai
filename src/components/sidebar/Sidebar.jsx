import React, { useState } from 'react';
import {
    HomeIcon,
    CalendarIcon,
    DocumentTextIcon,
    UserCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon
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
            <div className="hidden md:flex flex-col fixed h-screen w-64 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 text-white backdrop-blur-lg border-r border-white/10 z-10">
                <div className="p-4 border-b border-white/10 flex items-center bg-white/5">
                    <h1 className="text-xl font-bold">Prescode</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center space-x-2 text-gray-300 hover:text-white w-full p-3 rounded-lg transition-all duration-200 transform active:scale-95
                                    ${location.pathname === item.path ?
                                        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25' :
                                        'hover:bg-white/10 backdrop-blur-lg'}
                                `}
                            >
                                <div className="min-w-[24px]">
                                    <item.icon className={`h-6 w-6 transition-transform duration-300 ${location.pathname === item.path ? 'scale-110' : ''}`} />
                                </div>
                                <span className="whitespace-nowrap">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div className="bg-gradient-to-t from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border-t border-white/10 px-2 py-3">
                    <div className="flex justify-around items-center max-w-md mx-auto">
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
        </>
    );
};

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center px-3 py-1 w-full transition-transform active:scale-95"
    >
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
            <Icon
                className={`w-6 h-6 transition-all duration-200 ${isActive
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                        : 'text-gray-300'
                    }`}
            />
        </div>
        <span className={`text-xs mt-1 transition-colors duration-200 ${isActive ? 'text-[#7c3aed]' : 'text-gray-500'}`}>
            {label}
        </span>
    </button>
);

export default Sidebar;