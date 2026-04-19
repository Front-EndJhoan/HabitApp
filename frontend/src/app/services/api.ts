import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  Habit,
  HabitStats,
} from "../types";

const rawApiUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
const API_BASE_URL = (rawApiUrl ?? "/api").replace(/\/+$/, "");

if (typeof window !== "undefined") {
  if (!rawApiUrl && import.meta.env?.MODE === "production") {
    console.warn(
      "[HabitApp] No VITE_API_URL configurada, usando ruta relativa /api. Asegúrate de que el backend recibe peticiones en /api."
    );
  } else if (rawApiUrl?.includes("/auth")) {
    console.warn(
      "[HabitApp] VITE_API_URL no debe incluir /auth. Use la URL base del backend, por ejemplo https://api.example.com/api"
    );
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    return handleResponse<{ user: User }>(response);
  },
  register: async (credentials: RegisterCredentials): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    return handleResponse<{ user: User }>(response);
  },
  logout: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse<{ message: string }>(response);
  },
  getMe: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    });
    return handleResponse<User>(response);
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