import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('baseURL', process.env.REACT_APP_API_BASE_URL);

export default AxiosInstance;
