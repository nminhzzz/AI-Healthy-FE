import apiClient from './apiClient';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types';

/**
 * Authenticate a user via the OAuth2‑compatible login endpoint.
 * FastAPI's OAuth2PasswordRequestForm expects `application/x-www-form-urlencoded`.
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);

  const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
}

/**
 * Register a new user account.
 */
export async function register(data: RegisterRequest): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', data);
  return response.data;
}

/**
 * Fetch the currently authenticated user's profile.
 */
export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}

/**
 * Obtain a new access token using the HttpOnly refresh‑token cookie.
 */
export async function refreshToken(): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/refresh');
  return response.data;
}

/**
 * Log the current user out (clears the refresh‑token cookie server‑side).
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
