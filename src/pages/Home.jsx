import React, { useEffect } from 'react';
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
            </div>
        </ParallaxProvider>
    );
};

export default Home;