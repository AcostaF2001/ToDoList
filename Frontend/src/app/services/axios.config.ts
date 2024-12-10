import axios from 'axios';

// Crear una instancia de Axios con la configuración base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL para tu backend
  timeout: 10000, // Tiempo máximo de espera en milisegundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir el token en las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Obtener el token del localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
