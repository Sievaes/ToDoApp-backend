const user = require("../models/user")
const jwt = require("jsonwebtoken")
const logger = require("./logger")
const User = require("../models/user")

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method)
  logger.info("Path:", req.path)
  logger.info("Body:", req.body)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "")
  }
  next()
}

const userExtractor = async (req, res, next) => {
  try {
    if (req.token) {
      const decodedToken = jwt.decode(req.token, process.env.SECRET)
      req.user = await User.findById(decodedToken.id)
    }

    next()
  } catch (error) {
    next(error)
  }
}

const errorHandler = (error, req, res, next) => {
  if (error.message.includes("E11000 duplicate key error")) {
    return res.status(400).json({ error: "Username not available" })
  }
  console.log("ERROR: ", error.name)
}

const unknownEndpoint = (req, res) => {
  res.status(404).json("Unknown endpoint")
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
}
