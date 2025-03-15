const tasksRouter = require("express").Router()
const logger = require("../utils/logger")
const jwt = require("jsonwebtoken")
const Task = require("../models/task")
const User = require("../models/user")

//GET tasks
tasksRouter.get("/", async (req, res, next) => {
  try {
    const token = req.token

    if (!token) {
      res.status(401).json({ error: "token missing" })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken) {
      res.status(401).json({ error: "invalid token" })
    }

    const user = await User.findById(decodedToken.id)

    const tasks = await Task.find({ user: user.id })
    res.status(200).json(tasks)
  } catch (error) {
    next(error)
  }
})

//POST new task
tasksRouter.post("/", async (req, res, next) => {
  try {
    const { task, description, priority, completed, subTasks } = req.body

    const token = req.token

    if (!token) {
      res.status(401).json({ error: "token missing" })
    }

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken) {
      res.status(401).json({ error: "invalid token" })
    }

    const user = req.user

    const newTask = new Task({
      task: task,
      description: description,
      priority: priority,
      completed: completed,
      subTasks: subTasks,
      user: user.id,
    })

    const savedTask = await newTask.save()
    user.tasks = user.tasks.concat(savedTask._id)
    await user.save()
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

// DELETE task
tasksRouter.delete("/:id", async (req, res, next) => {
  try {
    const token = req.token

    if (!token) {
      res.status(401).json({ error: "token missing" })
    }

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken) {
      res.status(401).json({ error: "invalid token" })
    }

    const response = await Task.findByIdAndDelete(req.params.id)
    if (response) {
      res.status(204).end()
    } else {
      res.status(404).json({ message: "Task not found" })
    }
  } catch (error) {
    next(error)
  }
})

//PUT delete subtask
tasksRouter.put(
  "/:taskId/subtasks/:subTaskId/remove",
  async (req, res, next) => {
    try {
      const { taskId, subTaskId } = req.params
      const response = await Task.findByIdAndUpdate(
        taskId,
        { $pull: { subTasks: { _id: subTaskId } } },
        { new: true }
      )

      if (response) {
        const updatedTask = await Task.findById(taskId)
        res.status(200).json(updatedTask)
      } else {
        res.status(404).json({ message: "Subtask not found" })
      }
    } catch (error) {
      next(error)
    }
  }
)

//PUT change task to completed
tasksRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const body = req.body
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true })
    res.status(200).json(updatedTask)
  } catch (error) {
    next(error)
  }
})

//PUT change subtask to completed
tasksRouter.put(
  "/:taskId/subtasks/:subTaskId/completed",
  async (req, res, next) => {
    try {
      const { taskId, subTaskId } = req.params
      const response = await Task.findOneAndUpdate(
        { _id: taskId, "subTasks._id": subTaskId },
        { $set: { "subTasks.$.completed": true } },
        { new: true }
      )

      if (response) {
        const updatedTask = await Task.findById(taskId)
        res.status(200).json(updatedTask)
      } else {
        res.status(404).json({ message: "Subtask not found" })
      }
    } catch (error) {
      next(error)
    }
  }
)

module.exports = tasksRouter
