export const errorHandler = (error, req, res, next) => {
  const { status = 500, message } = error;
  res.status(status).json({
    status,
    // message: 'Something went wrong',
    // data: message,
    message,
  });
};
