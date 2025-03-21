export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  export interface AuthState {
    accessToken: string | null;
    user: User | null;
  }

  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }

  export interface AuthResponse {
    access_token: string;
    accessToken?: string;
    user: User;
  }