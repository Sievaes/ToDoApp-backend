const userRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")

//GET all users

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("tasks", {
      task: 1,
      description: 1,
      priority: 1,
      createdAt: 1,
      updatedAt: 1,
      completed: 1,
      subTasks: 1,
    })

    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
})

//POST new user
userRouter.post("/", async (req, res, next) => {
  console.log(req.body)
  try {
    const { name, newUserUsername, newUserPassword } = req.body

    if (newUserUsername.length < 3 || newUserPassword.length < 3) {
      return res.status(400).json({
        error: "Username and Password must be at least 3 characters",
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newUserPassword, saltRounds)

    const user = new User({
      // name: name,
      username: newUserUsername,
      password: passwordHash,
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = userRouter
