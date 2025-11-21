export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

// Fest API Types
export interface Fest {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  tagline?: string;
  college: string;
  date: string;
  duration?: string;
  location: {
    city: string;
    state: string;
    address?: string;
    coordinates?: number[];
  };
  organizer: {
    name: string;
    role: string;
    college: string;
    email?: string;
    phone?: string;
    instagram?: string;
    linkedin?: string;
  };
  entryType: string;
  entryFee?: number;
  expectedFootfall?: string;
  website?: string;
  brochure?: string;
  events: Array<{
    name: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    prize?: string;
    limit?: string;
  }>;
  hostedBy: {
    _id: string;
    name: string;
    email: string;
    college?: string;
  };
  registrationsCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FestsResponse {
  fests: Fest[];
  total: number;
  skip: number;
  limit: number;
}

export interface Registration {
  _id: string;
  user: string;
  fest: Fest;
  registeredEvents: string[];
  status: string;
  paymentStatus: string;
  paymentAmount: number;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

// Fest API Functions
export async function fetchFests(params?: {
  skip?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<FestsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/api/fests?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch fests");
  }

  return response.json();
}

export async function fetchFestBySlug(slug: string): Promise<Fest> {
  const response = await fetch(`${API_BASE_URL}/api/fests/${slug}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Fest not found");
  }

  return response.json();
}

export async function createFest(data: any): Promise<Fest> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/fests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create fest");
  }

  return response.json();
}

export async function updateFest(festId: string, data: any): Promise<Fest> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/api/fests/${festId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to update fest");
  }

  return response.json();
}

export async function registerForFest(festId: string, registeredEvents?: string[]): Promise<Registration> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/fests/${festId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ registeredEvents: registeredEvents || [] }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}

export async function getMyRegistrations(): Promise<Registration[]> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/registrations/my-registrations`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch registrations");
  }

  return response.json();
}

export async function getMyHostedFests(): Promise<Fest[]> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/fests/user/my-fests`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hosted fests");
  }

  return response.json();
}

export async function deleteFest(festId: string): Promise<void> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/fests/${festId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete fest");
  }
}

