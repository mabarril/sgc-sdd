const API_URL = 'http://localhost:5000/api';

export interface ApiError {
  message: string;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('sgc_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Ocorreu um erro na requisição');
  }

  return data as T;
}

export const api = {
  setToken(token: string) {
    localStorage.setItem('sgc_token', token);
  },

  getToken() {
    return localStorage.getItem('sgc_token');
  },

  clearToken() {
    localStorage.removeItem('sgc_token');
  },

  async login(email: string, password: string) {
    const res = await apiFetch<{ token: string; user: { id: string; name: string; email: string; role: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(res.token);
    localStorage.setItem('sgc_user', JSON.stringify(res.user));
    return res;
  },

  async register(name: string, email: string, password: string) {
    return apiFetch<{ id: string; name: string; email: string; role: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }
    );
  },

  async registerClub(club: {
    name: string;
    association: string;
    localChurch: string;
    city: string;
    state: string;
    foundingDate: string;
  }) {
    return apiFetch<{
      id: string;
      name: string;
      uniqueCode: string;
      association: string;
      localChurch: string;
      city: string;
      state: string;
      foundingDate: string;
      directorId: string;
    }>('/clubs', {
      method: 'POST',
      body: JSON.stringify(club),
    });
  },

  async getClub() {
    return apiFetch<{
      id: string;
      name: string;
      uniqueCode: string;
      association: string;
      localChurch: string;
      city: string;
      state: string;
      foundingDate: string;
    }>('/clubs/me');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('sgc_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
