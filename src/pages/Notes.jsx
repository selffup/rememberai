import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { notesApi } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Notes = () => {
    const { isDarkMode } = useTheme();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        tags: ''
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await notesApi.getAllNotes();
            setNotes(response.data.notes);
            setError(null);
        } catch (err) {
            setError('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setFormData({
            description: note.description,
            category: note.category || '',
            tags: note.tags ? note.tags.join(', ') : ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const noteData = {
                ...formData,
                tags: tagsArray
            };

            let response;
            if (editingNote) {
                response = await notesApi.updateNote(editingNote._id, noteData);
                setNotes(notes.map(note => 
                    note._id === editingNote._id ? response.data.note : note
                ));
            } else {
                response = await notesApi.createNote(noteData);
                setNotes([response.data.note, ...notes]);
            }

            setIsModalOpen(false);
            setEditingNote(null);
            setFormData({ description: '', category: '', tags: '' });
        } catch (err) {
            
            setError(`Failed to ${editingNote ? 'update' : 'create'} note`);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
        setFormData({ description: '', category: '', tags: '' });
    };

    const handleDelete = async (id) => {
        try {
            await notesApi.deleteNote(id);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            setError('Failed to delete note');
        }
    };

    const categories = ['all', ...new Set(notes.map(note => note.category).filter(Boolean))];

    const filteredNotes = selectedCategory === 'all'
        ? notes
        : notes.filter(note => note.category === selectedCategory);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen overflow-y-auto ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100'}`}>
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black opacity-40 transform rotate-45 scale-150 translate-x-1/4 translate-y-1/4 animate-wave-slow" />
                <div className="absolute inset-0 bg-gradient-to-l from-black via-gray-800 to-gray-900 opacity-40 transform -rotate-45 scale-150 -translate-x-1/4 -translate-y-1/4 animate-wave-fast" />
            </div>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />

            <main className="relative flex-1 isolate px-6 pt-14 lg:px-8 transition-all duration-300 md:ml-[16rem] lg:ml-[16rem] overflow-hidden">
                <div className="max-w-6xl mx-auto p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Notes</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5" />
                            New Note
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Note Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={closeModal} />

                                <div className="relative inline-block w-full sm:max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/10 mx-auto sm:mx-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-medium text-white">
                                            {editingNote ? 'Edit Note' : 'Create Note'}
                                        </h3>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                rows="4"
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Enter note description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                id="category"
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Enter category"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                                                Tags
                                            </label>
                                            <input
                                                type="text"
                                                id="tags"
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Enter tags (comma separated)"
                                                value={formData.tags}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                            >
                                                {editingNote ? 'Update' : 'Create'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-6">
                            {filteredNotes.map((note) => (
                                <div key={note._id} className={`p-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} backdrop-blur-lg rounded-lg shadow-md hover:shadow-lg transition-shadow border`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(note.createdAt).toLocaleDateString()}</p>
                                            {note.category && (
                                                <span className={`inline-block px-2 py-1 mt-2 text-xs font-medium ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-900'} rounded-full`}>
                                                    {note.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(note)}
                                                className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note._id)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{note.description}</p>
                                    {note.tags && note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {note.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {filteredNotes.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">
                                {selectedCategory === 'all'
                                    ? 'No notes yet. Create your first note!'
                                    : `No notes in the ${selectedCategory} category.`}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Notes;