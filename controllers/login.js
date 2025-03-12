const loginRouter = require("express").Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//POST login user
loginRouter.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })

    if (!user) {
      res.status(401).json({ error: "Invalid Username or Password" })
    }

    const passwordCorrect = await bcrypt.compare(password, user.password)

    if (!passwordCorrect) {
      res.status(401).json({ error: "Invalid Username or Password" })
    }

    const userToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userToken, process.env.SECRET)
    if (token) {
      res.status(200).send({ token, username: user.username, name: user.name })
    } else {
      res.status(401).json({ error: "error generating token" })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
