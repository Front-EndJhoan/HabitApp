import express from "express";
import Habit from "../models/Habit.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// GET /api/habits
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/habits/stats
router.get("/stats", async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });
    res.json({
      totalHabits: habits.length,
      completedToday: habits.filter((h) => h.completed).length,
      streak: 0, // Puedes calcularlo después
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/habits
router.post("/", async (req, res) => {
  try {
    const habit = new Habit({ ...req.body, userId: req.user._id });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/habits/:id/toggle
router.put("/:id/toggle", async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    habit.completed = !habit.completed;
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /api/habits/:id
router.patch("/:id", async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/habits/:id
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;