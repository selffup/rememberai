import React, { useEffect, useState } from 'react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { motion, useScroll, useSpring } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Components
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import About from '../components/home/About';
import Trust from '../components/home/Trust';
import FAQ from '../components/home/FAQ';
import Footer from '../components/home/Footer';
import BrainRoadmap from '../components/home/BrainRoadmap';

const Home = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    // Initialize installation state
    useEffect(() => {
        const isInstalled = localStorage.getItem('pwaInstalled') === 'true';
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        
        if (isInstalled || isStandalone) {
            setShowInstallButton(false);
            localStorage.setItem('pwaInstalled', 'true');
        } else {
            setShowInstallButton(true);
        }
    }, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Only show install button if not already installed
            if (!localStorage.getItem('pwaInstalled')) {
                setShowInstallButton(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if running in standalone mode (PWA installed)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            localStorage.setItem('pwaInstalled', 'true');
            setShowInstallButton(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    useEffect(() => {
        const handleAppInstalled = () => {
            setShowInstallButton(false);
            localStorage.setItem('pwaInstalled', 'true');
        };

        const handleAppUninstalled = () => {
            setShowInstallButton(true);
            localStorage.removeItem('pwaInstalled');
            // Force check display mode
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                localStorage.removeItem('pwaInstalled');
            }
        };

        const handleDisplayModeChange = (e) => {
            if (!e.matches) { // Not in standalone mode
                localStorage.removeItem('pwaInstalled');
                setShowInstallButton(true);
            }
        };

        const displayModeMediaQuery = window.matchMedia('(display-mode: standalone)');
        displayModeMediaQuery.addListener(handleDisplayModeChange);

        window.addEventListener('appinstalled', handleAppInstalled);
        window.addEventListener('appuninstalled', handleAppUninstalled);

        return () => {
            displayModeMediaQuery.removeListener(handleDisplayModeChange);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('appuninstalled', handleAppUninstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        try {
            // Show the installation prompt
            await deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const choiceResult = await deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the installation prompt');
                setShowInstallButton(false);
                localStorage.setItem('pwaInstalled', 'true');
            } else {
                console.log('User dismissed the installation prompt');
            }
        } catch (error) {
            console.error('Error during PWA installation:', error);
        } finally {
            // Clear the deferredPrompt for future use
            setDeferredPrompt(null);
        }
    };


    const particlesInit = async (main) => {
        await loadFull(main);
    };

    return (
        <ParallaxProvider>
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-white via-gray-400 to-gray-800 transform-origin-0"
                    style={{ scaleX }}
                />
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black opacity-40 transform rotate-45 scale-150 translate-x-1/4 translate-y-1/4 animate-wave-slow" />
                    <div className="absolute inset-0 bg-gradient-to-l from-black via-gray-800 to-gray-900 opacity-40 transform -rotate-45 scale-150 -translate-x-1/4 -translate-y-1/4 animate-wave-fast" />
                </div>
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
                <div className="relative z-10">
                    <Parallax speed={-5}>
                        <Hero />
                    </Parallax>
                    <Parallax speed={-3}>
                        <BrainRoadmap />
                    </Parallax>
                    <Parallax speed={-2}>
                        <Features />
                    </Parallax>
                    <About />
                    <Trust />
                    <FAQ />
                    <Footer />
                </div>
                {showInstallButton && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={handleInstallClick}
                        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 z-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Install App</span>
                    </motion.button>
                )}
            </div>
        </ParallaxProvider>
    );
};

export default Home;