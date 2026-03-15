// User Controller — handles user stats and profile

import Gamification from '../models/gamificationModel.js';

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const stats = await Gamification.getUserStats(userId);
    
    return res.status(200).json({ stats });
  } catch (err) {
    next(err);
  }
};
