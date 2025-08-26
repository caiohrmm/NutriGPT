import axios from 'axios';
import { API_BASE_URL, ACCESS_HEADER_NAME } from './config';
import { getAccessToken, setAccessToken } from './tokens';

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const nextAccess = response.headers?.[ACCESS_HEADER_NAME] as string | undefined;
    if (nextAccess) setAccessToken(nextAccess);
    return response;
  },
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      try {
        original._retry = true;
        // Tenta refresh explícito; o cookie httpOnly será enviado automaticamente
        await http.post('/auth/refresh');
        // Depois do refresh, repete a chamada original
        return http(original);
      } catch (_e) {
        // Falhou refresh; limpa token em memória
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  }
);


