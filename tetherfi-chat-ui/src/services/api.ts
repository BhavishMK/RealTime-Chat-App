import axios, { type InternalAxiosRequestConfig } from 'axios';

// 1. Define Base URLs from environment variables
const IDENTITY_BASE_URL =  'http://localhost:7277/api';
const CHAT_BASE_URL =  'http://localhost:7151/api';

// 2. Create the Identity Service Instance (Login/Register/User Status)
export const identityApi = axios.create({
    baseURL: IDENTITY_BASE_URL,
});

// 3. Create the Chat Service Instance (Message History/Colleagues List)
export const chatApi = axios.create({
    baseURL: CHAT_BASE_URL,
});

// 4. Shared Interceptor to attach JWT Token to ALL requests
const authInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// Apply interceptor to both instances
identityApi.interceptors.request.use(authInterceptor);
chatApi.interceptors.request.use(authInterceptor);

// 5. Centralized Hub URL for SignalR
export const HUB_URL =  'http://localhost:7151/chathub';

// Default export for convenience (usually points to the primary service)
export default identityApi;