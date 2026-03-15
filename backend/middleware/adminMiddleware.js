// Admin middleware — ensures the user has the 'admin' role.
// Must be used AFTER authenticateToken, which populates req.user.

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

export default requireAdmin;
