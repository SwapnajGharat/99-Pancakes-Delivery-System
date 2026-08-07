import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.99pancakes-panvel.com/v1', // Ready for backend integration
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
