const logger = require("./logger")

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method)
  logger.info("Path:", req.path)
  logger.info("Body:", req.body)
  next()
}

const errorHandler = (error, req, res, next) => {
  console.log("ERROR: ", error.name)
}

const unknownEndpoint = (req, res) => {
  res.status(404).json("Unknown endpoint")
}

module.exports = { requestLogger, errorHandler, unknownEndpoint }
