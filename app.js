const config = require("./utils/config")
const express = require("express")
const app = express()
const tasksRouter = require("./controllers/tasks")
const mongoose = require("mongoose")
const cors = require("cors")
const middleware = require("./utils/middleware")

mongoose.set("strictQuery", false)

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use("/api/tasks", tasksRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
