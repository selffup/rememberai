import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Bars3Icon } from '@heroicons/react/24/outline';
import EditableSlide from './EditableSlide';

export function SortableSlide({ slide, onEdit }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: slide.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 relative ${isDragging ? 'z-50' : 'z-0'}`}
        >
            <div className="group bg-white rounded-lg">
                {/* Drag Handle - Always visible */}
                <div
                    {...attributes}
                    {...listeners}
                    className="h-10 bg-gray-50 rounded-t-lg border-b border-gray-200 flex items-center justify-center cursor-move hover:bg-gray-100 transition-colors"
                >
                    <Bars3Icon className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Drag to reorder</span>
                </div>
                <EditableSlide
                    slide={slide}
                    onEdit={onEdit}
                    isDragging={isDragging}
                />
            </div>
        </motion.div>
    );
} 