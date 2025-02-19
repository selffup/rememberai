import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import PresentationSlide from './PresentationSlide';

const EditableSlide = ({ slide, onEdit, isDragging }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');

    const handleEdit = () => {
        setEditContent(slide.content);
        setIsEditing(true);
    };

    const handleSave = async () => {
        await onEdit(slide.id, editContent);
        setIsEditing(false);
    };

    return (
        <div 
            className={`
                group relative bg-white transition-all
                ${isDragging ? 'shadow-2xl scale-105' : 'hover:shadow-sm'}
            `}
        >
            {!isEditing ? (
                <>
                    <button
                        onClick={handleEdit}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-gray-100 z-10"
                    >
                        <PencilIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="relative">
                        <div className="relative z-0">
                            <PresentationSlide {...slide} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-6">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-40 p-4 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Edit slide content..."
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableSlide; 