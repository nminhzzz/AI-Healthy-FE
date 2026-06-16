import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

// ---------------------------------------------------------------------------
// Lazy import helper – avoids circular‑dependency issues between
// apiClient ↔ authStore. The store module is resolved at runtime on first use.
// ---------------------------------------------------------------------------
let _authStoreModule: typeof import('@/lib/stores/authStore') | null = null;

async function getAuthStore() {
  if (!_authStoreModule) {
    _authStoreModule = await import('@/lib/stores/authStore');
  }
  return _authStoreModule;
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // send HttpOnly cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Extend the Axios config type so we can safely set a `_retry` flag.
// ---------------------------------------------------------------------------
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ---------------------------------------------------------------------------
// Request interceptor – attach Bearer token when available
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  async (config) => {
    const { useAuthStore } = await getAuthStore();
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor – handle 401 → silent refresh → retry
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // Guard: no config or already retried → reject immediately
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Prevent infinite loop: do not intercept if the failed request IS the refresh request
    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    // Only attempt refresh on 401 Unauthorized
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        // The /auth/refresh endpoint reads the HttpOnly cookie
        const { data } = await apiClient.post<{ access_token: string }>(
          '/auth/refresh',
        );

        // Persist the new token in the store
        const { useAuthStore } = await getAuthStore();
        useAuthStore.getState().setAccessToken(data.access_token);

        // Retry the original request with the fresh token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed – force full logout
        const { useAuthStore } = await getAuthStore();
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
