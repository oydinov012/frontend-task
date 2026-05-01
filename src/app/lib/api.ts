// ⚙️ Configure your API base URL here
export const BASE_URL = 'http://localhost:8000';

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getTokens() {
  return {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  };
}
export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}
export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}
export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

// ─── Base request ─────────────────────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { access } = getTokens();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (access) headers['Authorization'] = `Bearer ${access}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 204) return null as T;

  if (!response.ok) {
    let errMsg = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      errMsg = err.detail || err.non_field_errors?.[0] || JSON.stringify(err);
    } catch {}
    throw new Error(errMsg);
  }

  return response.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function login(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/v1/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    let errMsg = 'Login failed';
    try {
      const err = await response.json();
      errMsg = err.detail || err.non_field_errors?.[0] || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  const json = await response.json();
  if (json.tokens) {
    setTokens(json.tokens.access, json.tokens.refresh_token);
  } else {
    setTokens(json.access, json.refresh);
  }
  
  return json;
}

export async function register(data: {
  username: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  const response = await fetch(`${BASE_URL}/api/v1/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errMsg = 'Registration failed';
    try {
      const err = await response.json();
      errMsg = Object.values(err).flat().join(', ') || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return response.json().catch(() => null);
}

export async function logout() {
  const { refresh } = getTokens();
  try {
    await request('/api/v1/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
  } finally {
    clearTokens();
  }
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export async function getProfile() {
  return request<Profile>('/api/v1/profile/');
}

export async function updateProfile(data: Partial<ProfileUpdate>) {
  return request<ProfileUpdate>('/api/v1/profile-edit/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function updatePhoto(file: File) {
  const { access } = getTokens();
  if(!access) {
    throw new Error('avtorizatsiyadan o\'ting!')
  }
  const formData = new FormData();
  formData.append('photo', file);
  const response = await fetch(`${BASE_URL}/api/v1/photo/`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${access}` },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Foto yangilashda xatolik yuz berdi');
  }
  
  return response.json();}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export async function getTasks(page = 1, pageSize = 10) {
  return request<PaginatedTaskList>(
    `/api/v1/tasks-create/?page=${page}&page_size=${pageSize}`
  );
}

export async function getTask(id: string) {
  return request<Task>(`/api/v1/tasks/${id}/`);
}

export async function createTask(data: {
  name: string;
  description: string;
  is_completed?: boolean;
  deadline:string | null;
}) {
  return request<Task>('/api/v1/tasks-create/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTask(id: string, data: Partial<Task>) {
  return request<Task>(`/api/v1/tasks/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id: string) {
  return request<null>(`/api/v1/tasks/${id}/`, { method: 'DELETE' });
}

// ─── History ──────────────────────────────────────────────────────────────────
export async function getHistory(page = 1, pageSize = 15) {
  return request<PaginatedHistoryList>(
    `/api/v1/history/?page=${page}&page_size=${pageSize}`
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  name: string;
  description: string;
  is_completed: boolean;
  deadline: string | null;
}

export interface Profile {
  first_name: string;
  last_name: string;
  username: string;
  phone: string | null;
  photo: string | null;
}

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  password?: string;
  confirm_password?: string;
}

export interface TaskHistory {
  id: number;
  task_name: string;
  change_details: string | null;
  changed_at: string;
}

export interface PaginatedTaskList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export interface PaginatedHistoryList {
  count: number;
  next: string | null;
  previous: string | null;
  results: TaskHistory[];
}
