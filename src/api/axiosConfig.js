import axios from 'axios';

// Create a new instance of axios with a custom configuration
const apiClient = axios.create({
  // We use an environment variable for the base URL.
  // This lets you easily switch between local and production backends.
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// This part is for later, but we'll add it now.
// It automatically adds the login token to every request header.
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  error => Promise.reject(error)
);

export default apiClient;