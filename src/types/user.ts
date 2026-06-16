export interface User {
  id: number;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: 'USER' | 'ADMIN';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string; // FastAPI OAuth2 uses 'username' field for email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
}
