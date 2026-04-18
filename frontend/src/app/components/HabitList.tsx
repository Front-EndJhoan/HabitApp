import { HabitItem } from "./HabitItem";
import type { Habit } from "../types";

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No habits yet</h3>
        <p className="text-gray-600">
          Create your first habit to start tracking your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
