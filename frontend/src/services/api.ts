import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance for authentication
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for authenticated requests
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  
  // Images
  images: '/images',
  imageStats: '/images/stats',
  imageThumbnail: (id: string) => `/images/${id}/thumbnail`,
  
  // Annotations
  annotations: '/annotations',
  annotationStats: '/annotations/stats',
  annotationsByImage: (imageId: string) => `/annotations/image/${imageId}`,
  
  // Users
  users: '/users',
  
  // Events
  events: '/events',
  eventStats: '/events/stats',
  
  // Export
  export: (imageId: string) => `/export/${imageId}`,
};

// API functions
export const apiService = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    authApi.post(endpoints.login, credentials),
  
  register: (userData: { email: string; name: string; password: string }) =>
    authApi.post(endpoints.register, userData),
  
  // Images
  getImages: (params?: any) => api.get(endpoints.images, { params }),
  getImage: (id: string) => api.get(`${endpoints.images}/${id}`),
  uploadImage: (formData: FormData) => api.post(endpoints.images, formData),
  updateImage: (id: string, data: any) => api.patch(`${endpoints.images}/${id}`, data),
  deleteImage: (id: string) => api.delete(`${endpoints.images}/${id}`),
  getImageStats: () => api.get(endpoints.imageStats),
  getImageThumbnail: (id: string, width?: number, height?: number) =>
    api.get(endpoints.imageThumbnail(id), { params: { width, height } }),
  
  // Annotations
  getAnnotations: (params?: any) => api.get(endpoints.annotations, { params }),
  getAnnotation: (id: string) => api.get(`${endpoints.annotations}/${id}`),
  createAnnotation: (data: any) => api.post(endpoints.annotations, data),
  updateAnnotation: (id: string, data: any) => api.patch(`${endpoints.annotations}/${id}`, data),
  deleteAnnotation: (id: string) => api.delete(`${endpoints.annotations}/${id}`),
  getAnnotationsByImage: (imageId: string) => api.get(endpoints.annotationsByImage(imageId)),
  getAnnotationStats: () => api.get(endpoints.annotationStats),
  bulkUpdateAnnotations: (data: { ids: string[]; updateData: any }) =>
    api.patch(`${endpoints.annotations}/bulk`, data),
  
  // Users
  getUsers: () => api.get(endpoints.users),
  getUser: (id: string) => api.get(`${endpoints.users}/${id}`),
  updateUser: (id: string, data: any) => api.patch(`${endpoints.users}/${id}`, data),
  deleteUser: (id: string) => api.delete(`${endpoints.users}/${id}`),
  
  // Events
  getEvents: (params?: any) => api.get(endpoints.events, { params }),
  getEventStats: () => api.get(endpoints.eventStats),
  
  // Export
  exportImage: (imageId: string, options: any) =>
    api.post(endpoints.export(imageId), options, { responseType: 'blob' }),
}; 