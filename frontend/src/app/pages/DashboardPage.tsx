import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HabitList } from "../components/HabitList";
import { AddHabitModal } from "../components/AddHabitModal";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import { Plus, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { habitsAPI } from "../services/api";
import type { Habit, HabitStats } from "../types";
import { toast } from "sonner";

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats>({ streak: 0, totalHabits: 0, completedToday: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHabits();
    loadStats();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await habitsAPI.getHabits();
      setHabits(data);
    } catch (error) {
      console.error("Error loading habits:", error);
      toast.error("Failed to load habits");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await habitsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await habitsAPI.toggleHabit(habitId);
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
        )
      );
      loadStats();
      toast.success("Habit updated!");
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit");
    }
  };

  const handleAddHabit = async (name: string, icon: string) => {
    try {
      const newHabit = await habitsAPI.createHabit({ name, icon });
      setHabits((prev) => [...prev, newHabit]);
      loadStats();
      toast.success("Habit created successfully!");
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await habitsAPI.deleteHabit(habitId);
      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
      loadStats();
      toast.success("Habit deleted successfully!");
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header */}
      <header
        className="bg-card border-b border-border sticky top-0 z-10"
        style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">H</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-400">HabitApp</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-xl"
          >
            <User className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Hello, {user?.username} 👋
          </h2>
          <p style={{ color: "var(--muted-foreground)" }}>Keep up the great work!</p>
        </div>

        {/* Stats Card */}
        <div
          className="rounded-2xl p-6 mb-8 shadow-lg bg-green-600"
          style={{ color: "var(--primary-foreground)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-4xl">🔥</span>
                <span className="text-gray-300 text-4xl font-bold">{stats.streak}</span>
              </div>
              <p className="text-gray-300">Day Streak</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-2xl font-semibold">
                {stats.completedToday}/{stats.totalHabits}
              </p>
              <p className="text-gray-300">Completed Today</p>
            </div>
          </div>
        </div>

        {/* Habits Section */}
        <div
          className="rounded-2xl p-6 shadow-sm mb-6"
          style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
        >
          <div className="flex items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-400">Your Habits</h3>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 rounded-xl h-10 gap-2"
              >
                <Plus className="size-5" />
                <span className="hidden sm:inline">Add Habit</span>
              </Button>
            </div>
          </div>

          <HabitList
            habits={habits}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
          />
        </div>
      </main>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddHabit}
      />
    </div>
  );
}
