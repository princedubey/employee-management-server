
const errorHandler = (err, req, res, next) => {
  console.error(err)
  let statusCode = 500

  if (err.statusCode) {
      statusCode = err.statusCode
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  })
}

module.exports = errorHandler
