import axios from 'axios';

/**
 * API 客户端配置
 * 封装所有后端接口请求
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getBackendOrigin = () => {
    const explicitOrigin = import.meta.env.VITE_BACKEND_ORIGIN;
    if (explicitOrigin) {
        try {
            return new URL(explicitOrigin).origin;
        } catch {
            return explicitOrigin;
        }
    }

    try {
        return new URL(API_BASE_URL).origin;
    } catch {
        try {
            return new URL(API_BASE_URL, window.location.origin).origin;
        } catch {
            return window.location.origin;
        }
    }
};

export const resolveBackendUrl = (pathOrUrl) => {
    if (!pathOrUrl) return pathOrUrl;
    if (/^(https?:)?\/\//i.test(pathOrUrl)) return pathOrUrl;
    if (/^(data:|blob:)/i.test(pathOrUrl)) return pathOrUrl;

    const origin = getBackendOrigin();
    try {
        return new URL(pathOrUrl, origin).toString();
    } catch {
        return pathOrUrl;
    }
};

// 创建 axios 实例
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
    }
);

// ============ 认证相关 API ============
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// ============ 作品相关 API ============
export const workAPI = {
    getAll: () => api.get('/works'),
    create: (data) => api.post('/works', data),
    update: (id, data) => api.put(`/works/${id}`, data),
    delete: (id) => api.delete(`/works/${id}`),
    updateOrder: (workIds) => api.put('/works/order', { workIds })
};

// ============ 作品集相关 API ============
export const portfolioAPI = {
    getConfig: () => api.get('/portfolio/config'),
    updateConfig: (data) => api.put('/portfolio/config', data),
    generate: () => api.post('/portfolio/generate'),
    getPreview: () => api.get('/portfolio/preview'),
    getTemplates: () => api.get('/portfolio/templates')
};

// ============ 上传相关 API ============
export const uploadAPI = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

export default api;
