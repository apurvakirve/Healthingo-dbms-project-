// Status Controller — handles GET /api/status

export const getStatus = (req, res) => {
  res.status(200).json({
    message: 'Healthingo backend running',
    timestamp: new Date().toISOString(),
    status: 'ok',
  });
};
