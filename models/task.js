const mongoose = require("mongoose")

const subTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
})

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  description: { type: String },
  priority: { type: Number },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  completed: { type: Boolean, default: false },
  subTasks: [subTaskSchema],
})

taskSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    if (returnedObject.subTasks) {
      returnedObject.subTasks = returnedObject.subTasks.map((subTask) => {
        subTask.id = subTask._id.toString()
        delete subTask._id
        return subTask
      })
    }
  },
})

module.exports = mongoose.model("Task", taskSchema)
