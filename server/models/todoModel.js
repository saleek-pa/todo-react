const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
      default: 3,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    order: {
      type: Number,
      required: true,
    },
    subTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTask',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
