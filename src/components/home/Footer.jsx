import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-white font-semibold mb-4">Product</h3>
                    <ul className="space-y-2">
                        <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                        <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link to="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Company</h3>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                        <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                        <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2">
                        <li><Link to="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                        <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
                        <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Connect</h3>
                    <ul className="space-y-2">
                        <li><a href="https://twitter.com/recallai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                        <li><a href="https://github.com/recallai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                        <li><a href="mailto:contact@recallai.com" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} RecallAI. All rights reserved.</p>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;