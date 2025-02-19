import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');
            console.log(token);
            if (token) {
                try {
                    // Store the token
                    localStorage.setItem('token', token);
                    
                    // Navigate to chat page
                    navigate('/chat');
                } catch (error) {
                    console.error('OAuth callback error:', error);
                    navigate('/login?error=auth_failed');
                }
            } else if (error) {
                console.error('OAuth error:', error);
                navigate(`/login?error=${error}`);
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [location, navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
        </div>
    );
} 