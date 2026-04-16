// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "This record already exists",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
export default errorHandler;
