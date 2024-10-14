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
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
