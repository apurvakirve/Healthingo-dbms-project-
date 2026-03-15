// Habit Controller — handles logging and history

import Habit from '../models/habitModel.js';

export const logHabits = async (req, res, next) => {
  try {
    const { water_intake, fruits_eaten, exercise_done, date } = req.body;
    const userId = req.user.userId;

    const success = await Habit.upsertLog({
      userId,
      waterIntake: !!water_intake,
      fruitsEaten: !!fruits_eaten,
      exerciseDone: !!exercise_done,
      date: date || new Date().toISOString().split('T')[0]
    });

    if (!success) {
      return res.status(500).json({ message: 'Failed to log habits.' });
    }

    return res.status(200).json({ message: 'Habits logged successfully.' });
  } catch (err) {
    next(err);
  }
};

export const getHabitHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Ensure user can only see their own history or is admin (skipped for simplicity)
    const logs = await Habit.findWeeklyLogs(userId);
    
    return res.status(200).json({ history: logs });
  } catch (err) {
    next(err);
  }
};
export const createHabit = async (req, res, next) => {
  try {
    const { habit_name, habit_description, frequency } = req.body;
    const userId = req.user.userId;

    if (!habit_name) {
      return res.status(400).json({ message: 'habit_name is required.' });
    }

    const habitId = await Habit.createHabit({
      userId,
      habitName: habit_name,
      habitDescription: habit_description,
      frequency: frequency || 'daily',
    });

    return res.status(201).json({ message: 'Habit created.', habitId });
  } catch (err) {
    next(err);
  }
};

export const getMyHabits = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habits = await Habit.getUserHabits(userId);
    return res.status(200).json({ habits });
  } catch (err) {
    next(err);
  }
};
