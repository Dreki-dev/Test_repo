import axios from 'axios';
import https from 'https';

const API_URL = "https://testv2.ravu8538.odns.fr";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

});

// Intercepteur de requête unifié
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Requête sortante:', {
      method: config.method,
      url: config.url,
      headers: config.headers
    });

    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse unifié
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erreur de réponse:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Gestion du token expiré
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;