import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaStop } from 'react-icons/fa'; // Add FaStop
import { IoSend } from 'react-icons/io5';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { chatAPI } from '../services/api'; // Import chatAPI
import './ChatInterface.css';

const SearchResultCard = ({ result }) => {
    if (!result || !result.searchStats) {
        return null;
    }

    return (
        <div className="search-empty">
            <h3 className="text-xl font-semibold text-gray-400 mb-3">{result.title}</h3>
            <p className="text-gray-500">{result.content}</p>
            <div className="search-stats-summary">
                <p>Searched {result.searchStats.totalNotesSearched} notes across {result.searchStats.totalBatches} batches</p>
                {result.searchStats.processingSummary && result.searchStats.processingSummary[0] && (
                    <p className="mt-2 text-sm">{result.searchStats.processingSummary[0].explanation}</p>
                )}
            </div>
        </div>
    );
};

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const silenceTimer = useRef(null);
    const analyserRef = useRef(null);
    const micStreamRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [isInputCentered, setIsInputCentered] = useState(true);
    const [responseType, setResponseType] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const lastProcessedTranscript = useRef('');
    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            console.log('Transcript updated:', transcript);
        }
    }, [transcript]);

    const handleRecord = () => {
        if (!browserSupportsSpeechRecognition) {
            alert('Browser does not support speech recognition. Please use Google Chrome.');
            return;
        }

        if (listening) {
            handleStopListening();
        } else {
            initializeRecording();
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
            setShowOverlay(true);
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
            const normalizedLevel = Math.min(average / 128, 1); // Ensure max of 1
            setAudioLevel(normalizedLevel);
            
            if (listening) {
                requestAnimationFrame(updateVolume);
            }
        };
        
        updateVolume();
    };
            
    const handleStartListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ 
            continuous: true,
            language: 'en-US'
        });

        // Start 5-second silence timer
        silenceTimer.current = setInterval(() => {
            if (analyserRef.current) {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                
                if (average < 10) { // Very low sound level
                    handleStopListening();
                }
            }
        }, 5000);
    };

    const handleStopListening = async () => {
        SpeechRecognition.stopListening();
        setShowOverlay(false);
        
        // Prevent processing if already processing or if transcript hasn't changed
        if (isProcessing || !transcript || transcript === lastProcessedTranscript.current) {
            resetTranscript();
            return;
        }

        const currentTranscript = transcript.trim();
        if (currentTranscript) {
            setIsProcessing(true);
            lastProcessedTranscript.current = currentTranscript;
            
            try {
                setIsInputCentered(false);
                setMessages(prev => [...prev, { text: currentTranscript, sender: 'user' }]);
                
                let response = await chatAPI.generatePresentation(currentTranscript);
                console.log(response);
                response = JSON.parse(response.data);

                const formattedResponse = {
                    text: response.content,
                    sender: 'ai',
                    type: response.contextType,
                    data: response
                };
                
                setMessages(prev => [...prev, formattedResponse]);
                setResponseType(response.contextType);
                scrollToBottom();
            } catch (error) {
                console.error('Error processing voice message:', error);
            } finally {
                setIsProcessing(false);
                resetTranscript();
                setMessage('');
            }
        }
        
        // Cleanup
        clearInterval(silenceTimer.current);
        if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const handleManualStop = () => {
        if (!isProcessing) {
            handleStopListening();
        }
    };

    useEffect(() => {
        // Clear the last processed transcript when starting a new recording
        if (listening) {
            lastProcessedTranscript.current = '';
        }
    }, [listening]);

    useEffect(() => {
        return () => {
            if (silenceTimer.current) {
                clearInterval(silenceTimer.current);
            }
            if (micStreamRef.current) {
                micStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message.trim()) {
            setIsInputCentered(false); // Move input down
            setMessages([...messages, { text: message, sender: 'user' }]);
            
            try {
                let response = await chatAPI.generatePresentation(message);
                console.log(response);

                response=JSON.parse(response.data);

                const formattedResponse = {
                    text: response.content,
                    sender: 'ai',
                    type: response.contextType,
                    data: response
                };
                
                setMessages(prev => [...prev, formattedResponse]);
                setResponseType(response.contextType);
                setMessage('');
                scrollToBottom();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
        
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderMessage = (msg) => {
        if (msg.sender === 'user') {
            return (
                <div className="message-bubble user-message">
                    <div className="user-avatar">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>
                    <div className="message-content">{msg.text}</div>
                </div>
            );
        }
        if (msg.type === 'search') {
            return <SearchResultCard result={msg.data} />;
        }
        return (
            <div className="message-bubble ai-message">
                <div className="ai-avatar">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#8B5CF6"/>
                        <path d="M15.75 8.25L11.25 12.75L8.25 9.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="message-content">{msg.text}</div>
            </div>
        );
    };

    return (
        <div className="flex-1 h-screen overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto mb-3">
                {!isInputCentered && (
                    <div className="messages-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {renderMessage(msg)}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            
            <form 
                onSubmit={handleSendMessage} 
                className={`input-area mb-14 ${isInputCentered ? 'centered' : ''}`}
            >
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field"
                    rows="1"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                />
                <div className="flex items-center gap-2">
                    <button 
                        type="button" 
                        onClick={handleRecord} 
                        className="icon-button"
                    >
                        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                    <button type="submit" className="icon-button">
                        <IoSend />
                    </button>
                </div>
            </form>
            
            {showOverlay && (
                <div className="voice-recognition-overlay">
                    <div className="recognition-content">
                        <div className="recognition-circle">
                            <div 
                                className="pulse-ring"
                                style={{
                                    '--scale': 1 + (audioLevel * 0.5),
                                    '--opacity': 0.2 + (audioLevel * 0.8)
                                }}
                            />
                            <div 
                                className="voice-button-large"
                                style={{
                                    '--intensity': audioLevel,
                                    '--scale': 1 + (audioLevel * 0.1)
                                }}
                            >
                                <FaMicrophone />
                            </div>
                        </div>
                        <div className="recognition-status">
                            {transcript ? '' : 'Listening...'}
                        </div>
                        <button 
                            className="stop-button"
                            onClick={handleManualStop}
                        >
                            <FaStop />
                            <span>Stop Recording</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;