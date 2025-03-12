const config = require("./utils/config")
const express = require("express")
const app = express()
const loginRouter = require("./controllers/login")
const userRouter = require("./controllers/users")
const tasksRouter = require("./controllers/tasks")
const mongoose = require("mongoose")
const cors = require("cors")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")

mongoose.set("strictQuery", false)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB database")
  })
  .catch((error) =>
    logger.error("Error connecting to the database", error.message)
  )

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use("/api/login", loginRouter)
app.use("/api/users", userRouter)
app.use("/api/tasks", tasksRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
