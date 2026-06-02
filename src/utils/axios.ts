import { SERVER_URL } from '@env';
import axios from 'axios';
import StorageHelper from './StorageHelper';
import AppConstants from './AppConstants';

const axiosClient = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async config => {
  const token = await StorageHelper.getData(
    AppConstants.STORAGE_KEYS.LOGIN_TOKEN,
  );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // config.headers.Authorization = `Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyZW1pbmQxMjNAZXhhbXBsZS5jb20iLCJpZCI6NSwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Nzg4NDE2MDEsImV4cCI6MTgxMDM3NzYwMX0.Esaeae2eGC9umGDHiqNJkN515ytfXK6y2yscGf6eAAO3xBPm65ed-yI27oeduNc-`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  error => {
    console.error(error, error.code, error.message);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  },
);

export default axiosClient;
