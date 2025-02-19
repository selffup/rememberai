import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { presentationsAPI, githubAPI, chatAPI } from '../services/api';

// Components
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/common/Header';
import PresentationArea from '../components/presentation/PresentationArea';
import InputArea from '../components/common/InputArea';

function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p className="font-bold">Something went wrong:</p>
            <pre className="mt-2 text-sm">{error.message}</pre>
            <button 
                onClick={resetErrorBoundary}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Try again
            </button>
        </div>
    );
}

export default function ChatLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [repositories, setRepositories] = useState([]);
    const [presentations, setPresentations] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [isConnectingGithub, setIsConnectingGithub] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [slides, setSlides] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        console.log("user", user);
        // Only fetch presentations and repositories if the user is logged in and connected to GitHub
        if (user && user.isGithubConnected) {
            fetchPresentations();
            fetchRepositories();
        }
    }, [user]); // Add user as a dependency to re-run if user state changes

    const fetchPresentations = async () => {
        try {
            const data = await presentationsAPI.getAllPresentations();
            setPresentations(data || []);
        } catch (error) {
            console.error('Error fetching presentations:', error);
            setError('Failed to load presentations');
        }
    };

    const fetchRepositories = async () => {
        try {
            const data = await githubAPI.getRepositories();
            setRepositories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching repositories:', error);
            setError('Failed to load repositories');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setSlides([]);

        try {
            const response = await chatAPI.generatePresentation(message, selectedRepo?.id);
            
            // Split the response into lines and process each SSE message
            const lines = response.data.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonStr = line.slice(6);
                        const slideData = JSON.parse(jsonStr);
                        setSlides(prevSlides => {
                            if (prevSlides.some(slide => slide.id === slideData.id)) {
                                return prevSlides;
                            }
                            return [...prevSlides, slideData];
                        });
                    } catch (e) {
                        console.error('Error parsing slide data:', e);
                    }
                }
            }
        } catch (err) {
            console.error('Error:', err);
            if (err.response) {
                // Server responded with an error
                setError(err.response.data.message || 'Failed to generate presentation. Please try again.');
            } else if (err.request) {
                // Request was made but no response received
                setError('No response from server. Please check your connection.');
            } else {
                // Error in request setup
                setError('Failed to generate presentation. Please try again.');
            }
        } finally {
            setIsLoading(false);
            setMessage('');
        }
    };

    const connectGithub = async () => {
        setIsConnectingGithub(true);
        setError(null);
        
        try {
            // This will get the auth URL and redirect to GitHub
            await githubAPI.connectGithub();
        } catch (error) {
            console.error('Error connecting to GitHub:', error);
            setError(error.response?.data?.message || 'Failed to connect to GitHub');
        } finally {
            setIsConnectingGithub(false);
        }
    };

    // Add useEffect to handle the GitHub callback
    useEffect(() => {
        const handleGithubCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            
            // Check if the user is already logged in or if the callback should be processed
            if (code && state && !user) { // Only process if there's no user logged in
                try {
                    setIsConnectingGithub(true);
                    await githubAPI.handleCallback(code, state);
                    // Refresh repositories after successful connection
                    await fetchRepositories();
                    // Clear URL parameters
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (error) {
                    console.error('GitHub callback error:', error);
                    setError('Failed to complete GitHub connection');
                } finally {
                    setIsConnectingGithub(false);
                }
            }
        };

        handleGithubCallback();
    }, [user]); // Add user as a dependency to re-run if user state changes

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        
        const newSlides = Array.from(slides);
        const [removed] = newSlides.splice(result.source.index, 1);
        newSlides.splice(result.destination.index, 0, removed);
        
        setSlides(newSlides);
    };

    const handleEditSlide = async (slideId, newContent) => {
        try {
            await chatAPI.updateSlide(slideId, newContent);
            setSlides(prevSlides =>
                prevSlides.map(slide =>
                    slide.id === slideId ? { ...slide, content: newContent } : slide
                )
            );
        } catch (error) {
            console.error('Error updating slide:', error);
            setError('Failed to update slide');
        }
    };

    useEffect(() => {
        const fetchSlides = async () => {
            const socket = new WebSocket('ws://your-websocket-url');

            socket.onmessage = (event) => {
                const newSlide = JSON.parse(event.data);
                setSlides(prevSlides => [...prevSlides, newSlide]);
            };

            return () => {
                socket.close(); // Clean up on unmount
            };
        };

        fetchSlides();
    }, []);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="h-screen flex bg-white">
                <Sidebar 
                    user={user}
                    presentations={presentations}
                    repositories={repositories}
                    onLogout={handleLogout}
                    onConnectGithub={connectGithub}
                    isConnectingGithub={isConnectingGithub}
                />

                <div className="flex-1 flex flex-col">
                    <Header 
                        selectedRepo={selectedRepo}
                        onSelectRepo={setSelectedRepo}
                        repositories={repositories}
                    />

                    <PresentationArea 
                        slides={slides}
                        isLoading={isLoading}
                        error={error}
                        onDragEnd={handleDragEnd}
                        onEditSlide={handleEditSlide}
                    />

                    <InputArea 
                        message={message}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                        onChange={(e) => setMessage(e.target.value)}
                        inputRef={inputRef}
                    />
                </div>
            </div>
        </ErrorBoundary>
    );
} 