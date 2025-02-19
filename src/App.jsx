import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatLayout from './layouts/ChatLayout';
import OAuthCallback from './components/auth/OAuthCallback';
import PaymentPage from './pages/PaymentPage';
import ChatInterface from './pages/ChatInterface';
import Sidebar from './components/sidebar/Sidebar';
import Home from './pages/Home';
import Events from './pages/Events';
import Notes from './pages/Notes';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading, logout } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#1a1a1a] relative">
            <Sidebar user={user} onLogout={logout} />
            <div className={`flex-1 overflow-hidden`}>
                {children}
            </div>
          
        </div>
    );
};

// Public Route Component (redirects to chat if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/chat" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                    <Route path="/auth/callback" element={<OAuthCallback />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                    <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
