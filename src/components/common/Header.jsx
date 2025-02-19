import { useState } from 'react';
import { CodeBracketIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Header = ({ selectedRepo, onSelectRepo, repositories }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // Ensure repositories is defined before filtering
    const filteredRepositories = repositories ? repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="border-b border-gray-200 bg-white p-4 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                        onClick={toggleDropdown}
                    >
                        <CodeBracketIcon className="h-5 w-5" />
                        <span>{selectedRepo?.name || 'Select Repository'}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
            {isDropdownOpen && (
                <div className="absolute bg-white border border-gray-300 mt-2 rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="max-h-60 overflow-y-auto">
                        {filteredRepositories.length > 0 ? (
                            filteredRepositories.map(repo => (
                                <div 
                                    key={repo.id}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        onSelectRepo(repo);
                                        setIsDropdownOpen(false); // Close dropdown after selection
                                    }}
                                >
                                    <span className="font-semibold">{repo.name}</span>
                                    <span className="block text-sm text-gray-500">{repo.url}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-500">No repositories found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header; 