const tasksRouter = require("express").Router()
const logger = require("../utils/logger")
const Task = require("../models/task")

//GET tasks
tasksRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({})

    res.status(200).json(tasks)
    console.log(tasks.map((task) => task.toJSON()))
  } catch (error) {
    next(error)
  }
})

//POST new task
tasksRouter.post("/", async (req, res, next) => {
  try {
    const newTask = new Task({
      task: req.body.task,
      description: req.body.description,
      priority: req.body.priority,
      completed: req.body.completed,
      subTasks: req.body.subTasks,
    })

    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    next(error)
  }
})

//POST initial tasks
tasksRouter.post("/init", async (req, res, next) => {
  try {
    await Task.insertMany(req.body)
    res.status(201).json({ Message: "initial tasks added" })
  } catch (error) {
    next(error)
  }
})

//DELETE delete ask

//PUT update task

module.exports = tasksRouter
