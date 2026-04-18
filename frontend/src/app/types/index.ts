export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  completed: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface HabitStats {
  streak: number;
  totalHabits: number;
  completedToday: number;
}
