const config = require("./utils/config")
const express = require("express")
const app = express()
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

app.use("/api/tasks", tasksRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
