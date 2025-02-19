import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSlide } from './SortableSlide';
import EditableSlide from './EditableSlide';
import { motion, AnimatePresence } from 'framer-motion';

const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5'
            }
        }
    })
};

const PresentationArea = ({ slides, isLoading, error, onDragEnd: onDragEndProp, onEditSlide }) => {
    const [activeId, setActiveId] = useState(null);
    const [items, setItems] = useState(slides);

    // Update items when slides prop changes
    useEffect(() => {
        setItems(slides);
    }, [slides]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1, // Make it easier to start dragging
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        // Add a class to the body to prevent scrolling while dragging
        document.body.classList.add('dragging');
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        document.body.classList.remove('dragging');

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            onDragEndProp({ 
                source: { index: oldIndex },
                destination: { index: newIndex }
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
        document.body.classList.remove('dragging');
    };

    const activeSlide = activeId ? items.find(slide => slide.id === activeId) : null;

    return (
        <div className="flex-1 overflow-y-auto px-8 py-4">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500">
                    {error}
                </div>
            ) : items.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <div className="max-w-4xl mx-auto">
                        <SortableContext
                            items={items}
                            strategy={verticalListSortingStrategy}
                        >
                            <AnimatePresence>
                                {items.map((slide) => (
                                    <SortableSlide
                                        key={slide.id}
                                        slide={slide}
                                        onEdit={onEditSlide}
                                    />
                                ))}
                            </AnimatePresence>
                        </SortableContext>
                    </div>

                    <DragOverlay dropAnimation={dropAnimationConfig}>
                        {activeId ? (
                            <div className="max-w-4xl mx-auto transform scale-105 opacity-90 bg-white shadow-2xl rounded-lg">
                                <EditableSlide
                                    slide={activeSlide}
                                    onEdit={onEditSlide}
                                    isDragging
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    Enter a message to generate a presentation
                </div>
            )}
        </div>
    );
};

export default PresentationArea; 