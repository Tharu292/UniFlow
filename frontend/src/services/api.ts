import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const taskAPI = {
  getAll: () => API.get('/tasks'),
  create: (data: any) => API.post('/tasks', data),
  update: (id: string, data: any) => API.put(`/tasks/${id}`, data),
  delete: (id: string) => API.delete(`/tasks/${id}`),
};

export const resourceAPI = {
  getAll: () => API.get('/resources'),
  upload: (formData: FormData) => API.post('/resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  download: (filename: string) => `${API.defaults.baseURL}/resources/download/${filename}`,
};

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;