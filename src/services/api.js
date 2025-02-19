import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Use Bearer consistently
            console.log("Adding token to request:", config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.error('Server error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        console.log("Login API response:", response.data);
        return response.data;
    },
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    signup: async (username, email, password) => {
        const response = await api.post('/auth/signup', { username, email, password });
        return response.data;
    },

    getMe: async () => {
        const token = localStorage.getItem('token');
        console.log("GetMe API call with token:", token);
        const response = await api.get('/auth/me');
        return response.data;
    },

    verifyToken: async () => {
        const response = await api.get('/auth/verify-token');
        return response.data;
    },

    // OAuth URLs
    getGithubAuthUrl: (isLogin = false) => `${BASE_URL}/auth/github?login=${isLogin}`,
    getGoogleAuthUrl: () => `${BASE_URL}/auth/google`,
};

// GitHub API
const githubAPI = {
    getRepositories: async () => {
        const response = await api.get('/github/repositories');
        return response.data;
    },

    connectGithub: async () => {
        try {
            const token = localStorage.getItem('token');
            // Get the authorization URL with the current auth token
            const response = await api.get('/github/connect', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Redirect to GitHub OAuth page with state parameter
            window.location.href = response.data.url;
        } catch (error) {
            throw new Error('Failed to initiate GitHub connection');
        }
    },

    // Add method to handle the callback
    handleCallback: async (code, state) => {
        const response = await api.post('/github/callback', { code, state });
        return response.data;
    },
};

// Presentations API
const presentationsAPI = {
    getAllPresentations: async () => {
        const response = await api.get('/presentations');
        return response.data;
    },

    getPresentation: async (id) => {
        const response = await api.get(`/presentations/${id}`);
        return response.data;
    },

    createPresentation: async (data) => {
        const response = await api.post('/presentations', data);
        return response.data;
    },

    updatePresentation: async (id, data) => {
        const response = await api.put(`/presentations/${id}`, data);
        return response.data;
    },

    deletePresentation: async (id) => {
        const response = await api.delete(`/presentations/${id}`);
        return response.data;
    },
};

// Chat API
const chatAPI = {
    generatePresentation: async (message, repositoryId) => {
        const response = await api.post('/chat/generate', {
            message,
            repositoryId,
        }, {
            responseType: 'text',
            headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
        return response;
    },

    updateSlide: async (slideId, content) => {
        const response = await api.put(`/chat/slides/${slideId}`, { content });
        return response.data;
    },
};

// Payment API
const paymentAPI = {
    createOrder: async (amount, currency) => {
        const response = await api.post('/payment/order', { amount, currency });
        return response.data;
    }
};

// Notes API endpoints
 const notesApi = {
    // Get all notes
    getAllNotes: () => api.get('/notes'),

    // Get a single note by ID
    getNote: (id) => api.get(`/notes/${id}`),

    // Create a new note
    createNote: (noteData) => api.post('/notes', noteData),

    // Update a note
    updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),

    // Delete a note
    deleteNote: (id) => api.delete(`/notes/${id}`)
};

export {
    api as default,
    authAPI,
    githubAPI,
    presentationsAPI,
    chatAPI,
    paymentAPI,
    notesApi
};