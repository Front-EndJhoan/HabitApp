import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  Habit,
  HabitStats,
} from "../types";


const fetchWithTimeout = (url: string, options: RequestInit, ms = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
};

const env = (import.meta as any).env ?? {};
const rawApiUrl = env.VITE_API_URL as string | undefined;

const normalizeApiUrl = (url: string): string => {
  const trimmed = url.replace(/\/+$/, "");
  if (/\/api(\/|$)/.test(trimmed)) return trimmed;
  return `${trimmed}/api`;
};

const getApiBaseUrl = (): string => {
  if (rawApiUrl) {
    return normalizeApiUrl(rawApiUrl);
  }
  // En producción, si no hay VITE_API_URL, usar la URL del sitio actual + /api
  if (env.MODE === "production") {
    return `${window.location.origin}/api`;
  }
  return "/api";
};

const API_BASE_URL: string = getApiBaseUrl();

if (typeof window !== "undefined") {
  if (!rawApiUrl && env.MODE === "production") {
    console.warn(`[HabitApp] Usando API base: ${API_BASE_URL}. Si el backend está en otro dominio, configura VITE_API_URL.`);
  } else if (rawApiUrl?.includes("/auth")) {
    console.warn("[HabitApp] VITE_API_URL no debe incluir /auth.");
  } else if (rawApiUrl && !rawApiUrl.includes("/api")) {
    console.warn(`[HabitApp] VITE_API_URL se normalizó a ${API_BASE_URL}.`);
  }
}

// Helper para manejar respuestas y errores HTTP
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.assign("/");
      }
      throw new Error("Unauthorized");
    }

    const error = await response.json().catch(() => ({ message: "Server error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      return handleResponse<{ user: User }>(response);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw new Error("El servidor tardó demasiado. Intenta de nuevo.");
      throw err;
    }
  },
  register: async (credentials: RegisterCredentials): Promise<{ user: User }> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      return handleResponse<{ user: User }>(response);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw new Error("El servidor tardó demasiado. Intenta de nuevo.");
      throw err;
    }
  },
  logout: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse<{ message: string }>(response);
  },
  getMe: async (): Promise<User> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/me`, { credentials: "include" });
      return handleResponse<User>(response);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw new Error("El servidor tardó demasiado. Intenta de nuevo.");
      throw err;
    }
  },
};

export const habitsAPI = {
  getHabits: async (): Promise<Habit[]> => {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      credentials: "include",
    });
    return handleResponse<Habit[]>(response);
  },

  getStats: async (): Promise<HabitStats> => {
    const response = await fetch(`${API_BASE_URL}/habits/stats`, {
      credentials: "include",
    });
    return handleResponse<HabitStats>(response);
  },

  createHabit: async (habit: { name: string; icon: string }): Promise<Habit> => {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(habit),
    });
    return handleResponse<Habit>(response);
  },

  toggleHabit: async (id: string): Promise<Habit> => {
    const response = await fetch(`${API_BASE_URL}/habits/${id}/toggle`, {
      method: "PUT",
      credentials: "include",
    });
    return handleResponse<Habit>(response);
  },

  updateHabit: async (id: string, updates: Partial<Habit>): Promise<Habit> => {
    const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updates),
    });
    return handleResponse<Habit>(response);
  },

  deleteHabit: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse<{ message: string }>(response);
  },
};