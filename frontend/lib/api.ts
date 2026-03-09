import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: async (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/login', data);
    return response.data;
  },
};

// Profile APIs
export const profileAPI = {
  create: async (data: {
    displayName: string;
    gender: string;
    birthday: string;
    height: number;
    weight: number;
    interests?: string[];
    about?: string;
  }) => {
    const response = await api.post('/createProfile', data);
    return response.data;
  },

  get: async () => {
    const response = await api.get('/getProfile');
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: async (data: any) => {
    const response = await api.put('/updateProfile', data);
    return response.data;
  },
};

// Chat APIs
export const chatAPI = {
  sendMessage: async (data: { receiverId: string; content: string }) => {
    const response = await api.post('/sendMessage', data);
    return response.data;
  },

  viewMessages: async (conversationId: string) => {
    const response = await api.get(`/viewMessages?conversationId=${conversationId}`);
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },
};

export default api;