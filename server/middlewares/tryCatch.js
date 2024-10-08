const tryCatchMiddleware = (tryCatchHandler) => async (req, res, next) => {
  try {
    await tryCatchHandler(req, res, next);
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      error_message: error.message,
    });
  }
};

module.exports = tryCatchMiddleware;
