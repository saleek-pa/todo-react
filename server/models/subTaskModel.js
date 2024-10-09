const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
