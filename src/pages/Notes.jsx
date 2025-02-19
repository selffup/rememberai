import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { notesApi } from '../services/api';

const Notes = () => {
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
        <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

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
                                <div key={note._id} className="p-6 bg-white/5 backdrop-blur-lg rounded-lg shadow-md hover:shadow-lg transition-shadow border border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</p>
                                            {note.category && (
                                                <span className="inline-block px-2 py-1 mt-2 text-xs font-medium bg-white/10 text-white rounded-full">
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
                                    <p className="text-white mb-4">{note.description}</p>
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