import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaStop } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { chatAPI } from '../../services/api';
import './assit.css';

const ResultCard = ({ query, result }) => {
    if (!result) return null;

    const commonClasses = "bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#7c3aed]/40 rounded-lg shadow-lg overflow-hidden mx-4 transition-all duration-300";

    // Handle loading state
    if (result.isLoading) {
        return (
            <div className={commonClasses}>
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white/70">{result.content}</p>
                    </div>
                    {query && (
                        <p className="text-white/50 text-sm mt-2">Query: {query}</p>
                    )}
                </div>
            </div>
        );
    }

    // Handle the remember response format
    if (result.contextType === "remember") {
        return (
            <div className={commonClasses}>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 text-[#7c3aed]">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 9h-2v2h2V9zm0 4h-2v2h2v-2zm4-4h-2v2h2V9zm0 4h-2v2h2v-2z"/>
                                <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
                            </svg>
                        </div>
                        <p className="text-white/70">Memory from {new Date(result.createdAt).toLocaleString()}</p>
                    </div>
                    {query && (
                        <p className="text-white/50 text-sm mb-2">Query: {query}</p>
                    )}
                    <p className="text-white text-lg">{result.description}</p>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            </div>
        );
    }
    if (result.contextType === "greeting") {
        return (
            <div className={commonClasses}>
                <div className="p-4">
                    {query && (
                        <p className="text-white/50 text-sm mb-2">Query: {query}</p>
                    )}
                    <p className="text-white text-md">{result.message}</p>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            </div>
        );
    }

    // Handle the original response format
    return (
        <div className={commonClasses}>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 text-[#7c3aed]">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
                        </svg>
                    </div>
                    <p className="text-white/70 text-sm">Response</p>
                </div>
                {query && (
                    <p className="text-white/50 text-sm mb-2">Query: {query}</p>
                )}
                <p className="text-white text-sm">{result.content || result.description}</p>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        </div>
    );
};


const FindButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [listening, setListening] = useState(false);
    const micStreamRef = useRef(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const analyserRef = useRef(null);
    const silenceTimer = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const lastProcessedTranscript = useRef('');
    const messagesEndRef = useRef(null);
    const [currentQuery, setCurrentQuery] = useState('');
    const [result, setResult] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const messagesPerPage = 5;

    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
        listening: speechListening
    } = useSpeechRecognition();

    const [requestQueue, setRequestQueue] = useState([]);
    const [isProcessingQueue, setIsProcessingQueue] = useState(false);

    useEffect(() => {
        setListening(speechListening);
    }, [speechListening]);

    const handleClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setInputText('');
            resetTranscript();
        }
    };

    const initializeRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micStreamRef.current = stream;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;
            
            startVolumeVisualization();
            handleStartListening();
        } catch (error) {
            console.error('Microphone access denied:', error);
        }
    };

    const startVolumeVisualization = () => {
        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const normalizedLevel = Math.min(average / 128, 1);
            setAudioLevel(normalizedLevel);
            
            if (listening) {
                requestAnimationFrame(updateVolume);
            }
        };
        
        updateVolume();
    };

    const handleVoiceInput = async () => {
        if (!browserSupportsSpeechRecognition) {
            alert('Browser does not support speech recognition.');
            return;
        }

        if (listening) {
            handleStopListening();
        } else {
            initializeRecording();
        }
    };

    const handleStartListening = () => {
        resetTranscript();
        lastProcessedTranscript.current = '';
        SpeechRecognition.startListening({ 
            continuous: true,
            language: 'en-US'
        });

        if (silenceTimer.current) {
            clearInterval(silenceTimer.current);
        }

        silenceTimer.current = setInterval(() => {
            if (analyserRef.current) {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                
                if (average < 10) {
                    console.log('Silence detected, stopping...');
                    handleStopListening();
                }
            }
        }, 5000);
    };

    const handleStopListening = async () => {
        SpeechRecognition.stopListening();
        
        const currentTranscript = transcript.trim();
        if (currentTranscript && currentTranscript !== lastProcessedTranscript.current) {
            setRequestQueue(prev => [...prev, currentTranscript]);
            lastProcessedTranscript.current = currentTranscript;
        }
        
        cleanup();
    };

    const processQueue = async () => {
        if (isProcessingQueue || requestQueue.length === 0) return;
        
        setIsProcessingQueue(true);
        
        try {
            const text = requestQueue[0];
            await processInput(text);
            setRequestQueue(prev => prev.slice(1));
        } catch (error) {
            console.error('Error processing queue:', error);
        } finally {
            setIsProcessingQueue(false);
        }
    };

    useEffect(() => {
        if (requestQueue.length > 0 && !isProcessingQueue) {
            processQueue();
        }
    }, [requestQueue, isProcessingQueue]);

    const processInput = async (text) => {
        if (!text.trim()) return;
        
        setIsProcessing(true);
        setCurrentQuery(text);
        
        // Show processing preview
        setResult({
            content: "Processing your request...",
            isLoading: true
        });
        
        try {
            let response = await chatAPI.generatePresentation(text);
            // Handle both JSON string and direct object responses
            let parsedResponse = response.data;
            if (typeof response.data === 'string') {
                try {
                    parsedResponse = JSON.parse(response.data);
                } catch (e) {
                    parsedResponse = { description: response.data };
                }
            }
            
            setResult(parsedResponse);
            
            setMessages(prev => [...prev, {
                query: text,
                response: parsedResponse,
                timestamp: new Date()
            }]);
            setCurrentPage(Math.floor(messages.length / messagesPerPage));
        } catch (error) {
            console.error('Error processing input:', error);
            setResult({
                title: 'Error',
                content: 'Failed to process your request.',
                searchStats: { totalNotesSearched: 0, totalBatches: 0 }
            });
        } finally {
            setIsProcessing(false);
            setInputText('');
            resetTranscript();
        }
    };

    const totalPages = Math.ceil(messages.length / messagesPerPage);
    const paginatedMessages = messages.slice(
        currentPage * messagesPerPage,
        (currentPage + 1) * messagesPerPage
    );

    const cleanup = () => {
        clearInterval(silenceTimer.current);
        if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach(track => track.stop());
        }
        analyserRef.current = null;
        setListening(false);
    };

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    useEffect(() => {
        if (listening) {
            lastProcessedTranscript.current = '';
        }
    }, [listening]);

    const handleSend = async () => {
        if (inputText.trim()) {
            await processInput(inputText);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [result]);

    return (
        <div className="assistant-container">
            {isOpen && (
                <div 
                    className="fixed z-30 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-95 transition-all duration-300 shadow-2xl"
                    style={{
                        inset: window.innerWidth <= 768 ? '0' : 'auto 20px 20px auto',
                        width: window.innerWidth <= 768 ? '100%' : '450px',
                        height: window.innerWidth <= 768 ? '100%' : '85vh',
                        borderRadius: window.innerWidth <= 768 ? '0' : '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid rgba(124, 58, 237, 0.2)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="text-white text-lg font-medium">How Can I Help?</h2>
                        <button 
                            onClick={handleClick}
                            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content area with flex-grow */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Messages area with auto scroll */}
                        <div className="flex-1 overflow-y-auto">
                            
                        </div>

                        {/* Pagination and input area */}
                        <div className="flex flex-col">
                            {messages.length > messagesPerPage && (
                                <div className="flex justify-center items-center gap-4 py-2 border-t border-white/10">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                        className="px-4 py-2 text-sm text-white/70 hover:text-white disabled:opacity-50 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-white/70">
                                        {currentPage + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className="px-4 py-2 text-sm text-white/70 hover:text-white disabled:opacity-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {result && (
                                <div className="animate-slideUp">
                                    <ResultCard query={currentQuery} result={result} />
                                </div>
                            )}

                            <div className="px-4 pb-4">
                                <div className={`bg-white/5 backdrop-blur-lg ${result ? 'rounded-b-xl' : 'rounded-xl'} shadow-lg overflow-hidden border border-white/10 hover:border-[#7c3aed]/40 transition-colors`}>
                                    <div className="flex items-center justify-between p-3">
                                        <input
                                            type="text"
                                            placeholder={isProcessing ? "Just a sec..." : "Ask Gemini"}
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            className="flex-1 bg-transparent text-white text-lg focus:outline-none placeholder-white/50 input-field"
                                            autoFocus
                                            disabled={isProcessing}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !isProcessing) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                        />
                                        <div className="flex items-center gap-2">
                                            {inputText ? (
                                                <button 
                                                    onClick={handleSend}
                                                    className={`p-2 ${isProcessing ? 'text-white/30' : 'text-[#7c3aed]'} hover:text-[#9d5cf5] transition-colors`}
                                                    disabled={isProcessing}
                                                >
                                                    <IoSend size={20} />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={handleVoiceInput}
                                                    className="p-2 text-[#7c3aed] hover:text-[#9d5cf5] relative transition-colors"
                                                    disabled={isProcessing}
                                                >
                                                    {listening && (
                                                        <div 
                                                            className="absolute inset-0 rounded-full bg-[#7c3aed] opacity-25 animate-pulse"
                                                            style={{ transform: `scale(${1 + audioLevel})` }}
                                                        />
                                                    )}
                                                    {listening ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button 
                    onClick={handleClick} 
                    className="fixed bottom-4 right-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:opacity-90 z-40 flex items-center gap-2 transition-all duration-300"
                >
                    <FaMicrophone size={20} />
                    <span>Ask Gemini</span>
                </button>
            )}
        </div>
    );
};

export default FindButton;