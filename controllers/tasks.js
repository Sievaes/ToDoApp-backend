const tasksRouter = require("express").Router()
const logger = require("../utils/logger")
const Task = require("../models/task")

//GET tasks
tasksRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({})

    res.status(200).json(tasks)
  } catch (error) {
    next(error)
  }
})

//POST new task
tasksRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body)
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

// DELETE task
tasksRouter.delete("/:id", async (req, res, next) => {
  try {
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

//DELETE delete subtask
tasksRouter.put("/:taskId/subtasks/:subTaskId", async (req, res, next) => {
  try {
    const { taskId, subTaskId } = req.params
    const response = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { subTasks: { _id: subTaskId } } },
      { new: true }
    )
    if (response) {
      const updatedTask = await Task.findById(taskId)
      console.log(updatedTask)
      res.status(200).json(updatedTask)
    } else {
      res.status(404).json({ message: "Subtask not found" })
    }
  } catch (error) {
    next(error)
  }
})

//PUT update task
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
module.exports = tasksRouter
