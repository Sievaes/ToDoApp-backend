const mongoose = require("mongoose")

const subTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
})

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  description: { type: String },
  priority: { type: String },
  createdAt: { type: String, default: Date.now },
  updatedAt: { type: String, default: Date.now },
  completed: { type: Boolean, default: false },
  subTasks: [subTaskSchema],
})

taskSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  },
})

module.exports = mongoose.model("Task", taskSchema)
