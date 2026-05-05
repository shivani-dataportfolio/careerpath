import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://careerpath-17rv.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token or Firebase Identity to requests
api.interceptors.request.use((config) => {
    // 1. Prioritize current Firebase user identity
    const currentUser = auth.currentUser;
    const firebaseEmail = currentUser?.email || localStorage.getItem('userEmail');

    if (firebaseEmail) {
        config.headers['x-user-email'] = firebaseEmail;
    }

    // 2. Legacy/Internal JWT Token (Fallback)
    const token = localStorage.getItem('token');
    if (token && !config.headers['x-user-email']) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


export const authService = {
    login: (credentials) => api.post('/token/', credentials),
    register: (userData) => api.post('/register/', userData),
    getProfile: () => api.get('/profile/'),
};

export const careerService = {
    analyzeResume: (formData) => api.post('/resume/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    saveResumeData: (data) => api.post('/resume/save/', data),
    getRecommendations: () => api.get('/recommendations/'),
    getSkillGap: (roleId) => api.get(`/skill-gap/${roleId}/`),
    selectUserRole: (roleId) => api.post('/user/select-role/', { roleId }),
    getProfile: () => api.get('/profile/'),
};

export default api;
