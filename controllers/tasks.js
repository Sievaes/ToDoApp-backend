const tasksRouter = require("express").Router()

const initialTasks = [
  {
    task: "Home cleaning",
    description: "Weekly cleaning",
    priority: "low",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completed: false,
    subTasks: [
      { title: "Vacuum living room", completed: false },
      { title: "Dust shelves", completed: false },
    ],
  },
  {
    task: "Grocery shopping",
    description: "Buy groceries for the week",
    priority: "medium",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completed: false,
    subTasks: [
      { title: "Buy vegetables", completed: false },
      { title: "Buy fruits", completed: false },
    ],
  },
  {
    task: "Project meeting",
    description: "Discuss project milestones",
    priority: "high",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completed: false,
    subTasks: [
      { title: "Prepare presentation", completed: false },
      { title: "Send meeting invite", completed: false },
    ],
  },
]

//GET tasks
tasksRouter.get("/", async (req, res, next) => {
  try {
    res.status(200).json(initialTasks)
  } catch (error) {
    next(error)
  }
})

module.exports = tasksRouter
