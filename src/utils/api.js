import axios from 'axios';
import config from '../../config/environment';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' }
});

export default api; 