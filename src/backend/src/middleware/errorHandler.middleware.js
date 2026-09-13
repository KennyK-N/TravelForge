const errorHandlerMiddleware = (err, req, res, next) => {
  let status;
  // To Handle Better Auth Status code
  if (err.statusCode && typeof err.statusCode === "number") {
    status = err.statusCode;
  } else {
    status = err.status;
  }
  res.status(status || 500).json({
    success: false,
    msg: err.message || "Internal Server Error",
    data: err.data || null,
  });
};

export default errorHandlerMiddleware;
