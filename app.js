const config = require("./utils/config")
const express = require("express")
const app = express()
const tasksRouter = require("./controllers/tasks")
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

mongoose.set
