import { Checkbox } from "./ui/checkbox";
import { Trash2 } from "lucide-react";
import type { Habit } from "../types";

interface HabitItemProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitItem({ habit, onToggle, onDelete }: HabitItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
        habit.completed
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <Checkbox
        id={habit.id}
        checked={habit.completed}
        onCheckedChange={() => onToggle(habit.id)}
        className={`size-6 rounded-lg ${
          habit.completed ? "data-[state=checked]:bg-green-600" : ""
        }`}
      />

      <label
        htmlFor={habit.id}
        className="flex items-center gap-3 flex-1 cursor-pointer select-none"
      >
        <span className="text-2xl">{habit.icon}</span>
        <span
          className={`text-lg ${
            habit.completed ? "text-gray-500 line-through" : "text-gray-900"
          }`}
        >
          {habit.name}
        </span>
      </label>

      {habit.completed && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full">
          <span className="text-sm font-medium text-green-700">✓ Done</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onDelete(habit.id)}
        className="rounded-full p-2 text-red-600 transition hover:bg-red-100 hover:text-red-800"
        aria-label={`Delete ${habit.name}`}
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
