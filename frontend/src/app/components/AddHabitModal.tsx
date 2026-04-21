import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string) => Promise<void>;
}

const ICON_OPTIONS = [
  "📚", "💪", "💧", "🏃", "🧘", "🎨", "🎵", "✍️",
  "🌱", "💤", "🥗", "🧠", "📝", "🎯", "⚡", "🔥",
  "🌟", "💻", "📖", "🍎", "☕", "🎮", "🌤️", "🧩",
];

export function AddHabitModal({ isOpen, onClose, onSave }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("📚");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    setIsLoading(true);
    try {
      await onSave(habitName, selectedIcon);
      setHabitName("");
      setSelectedIcon("📚");
      onClose();
    } catch (error) {
      console.error("Error saving habit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Habit</DialogTitle>
          <DialogDescription>
            Add a new habit to track your daily progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="h-12 rounded-xl"
              placeholder="e.g., Read for 30 minutes"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Choose an Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-2 text-2xl rounded-lg transition-all hover:scale-110 flex items-center justify-center ${
                    selectedIcon === icon
                      ? "bg-green-100 ring-2 ring-green-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
