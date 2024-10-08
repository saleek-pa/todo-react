const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'failure';

  res.status(statusCode).json({
    status,
    errorMessage: err.message || 'Something went wrong',
  });
};

module.exports = errorHandler;
