// Health Controller — handles health-related calculations (BMI, etc.)
import pool from '../config/db.js';

export const calculateBMI = async (req, res, next) => {
  try {
    const { height, weight } = req.body;

    if (!height || !weight) {
      return res.status(400).json({ message: 'Height and weight are required.' });
    }

    const hMeters = parseFloat(height) / 100;
    const wKg = parseFloat(weight);

    if (isNaN(hMeters) || isNaN(wKg) || hMeters <= 0 || wKg <= 0) {
      return res.status(400).json({ message: 'Invalid height or weight values.' });
    }

    const bmi = parseFloat((wKg / (hMeters * hMeters)).toFixed(1));
    let category = '';

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    // Save to DB if authenticated
    if (req.user?.userId) {
      await pool.query(
        'UPDATE Users SET latest_bmi = ?, bmi_category = ?, bmi_calculated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [bmi, category, req.user.userId]
      );
    }

    return res.status(200).json({
      bmi,
      category,
      message: `Your BMI is ${bmi}, which is classified as ${category}.`
    });
  } catch (err) {
    next(err);
  }
};
