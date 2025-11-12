const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SignUpData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  college?: string;
  role?: "student" | "organizer" | "admin";
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    college?: string;
  };
}

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Sign up failed");
  }

  return response.json();
}

export async function signIn(data: SignInData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Sign in failed");
  }

  return response.json();
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

