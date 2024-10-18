const mongoose = require('mongoose');
const User = require('../models/userModel');
const Todo = require('../models/todoModel');
const SubTask = require('../models/subTaskModel');

const getAllTodos = async (req, res) => {
  const { priorities, searchTerm } = req.query;
  const { userId } = req.user;

  let filterConditions = {};

  if (priorities) {
    filterConditions.priority = { $in: priorities.split(',').map(Number) };
  }

  if (searchTerm) {
    filterConditions.$or = [
      {
        title: {
          $regex: new RegExp(searchTerm, 'i'),
        },
      },
      {
        'subTasks.title': {
          $regex: new RegExp(searchTerm, 'i'),
        },
      },
    ];
  }

  const getTodosPipeline = (extraMatch) => [
    {
      $match: { ...filterConditions, ...extraMatch },
    },
    {
      $lookup: {
        from: 'subtasks',
        localField: 'subTasks',
        foreignField: '_id',
        as: 'subTasks',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assigneeIds',
        foreignField: '_id',
        as: 'assignees',
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              image: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'createdUser',
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              image: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: '$createdUser',
    },
    {
      $addFields: {
        subTasks: {
          $sortArray: {
            input: '$subTasks',
            sortBy: { order: 1 },
          },
        },
      },
    },
    {
      $sort: { order: 1 },
    },
    {
      $facet: {
        pendingTodos: [{ $match: { status: 'pending' } }],
        completedTodos: [{ $match: { status: 'completed' } }],
      },
    },
  ];

  const [createdTodos] = await Todo.aggregate(
    getTodosPipeline({ userId: new mongoose.Types.ObjectId(`${userId}`) })
  );

  const [assignedTodos] = await Todo.aggregate(
    getTodosPipeline({ assigneeIds: new mongoose.Types.ObjectId(`${userId}`) })
  );

  return res.status(200).json({
    status: 'success',
    message: 'Todos retrieved successfully',
    data: {
      createdTodos,
      assignedTodos,
    },
  });
};

const createTodo = async (req, res) => {
  const todoData = req.body;
  const { userId } = req.user;

  const minOrderTodo = await Todo.findOne().sort({ order: 1 });
  const newOrder = minOrderTodo ? minOrderTodo.order - 1 : 1;

  const newTodo = await Todo.create({
    ...todoData,
    order: newOrder,
    userId,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Todo created successfully',
    data: newTodo,
  });
};

const updateTodo = async (req, res) => {
  const { todoId } = req.params;
  const todo = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(todoId, todo, { new: true });
  if (!updatedTodo) {
    return res.status(404).json({
      status: 'failure',
      message: 'Todo not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Todo updated successfully',
    data: updatedTodo,
  });
};

const toggleStatusTodo = async (req, res) => {
  const { todoId } = req.params;
  const todo = await Todo.findById(todoId);
  if (!todo) {
    return res.status(404).json({
      status: 'failure',
      message: 'Todo not found',
    });
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    todoId,
    { status: todo.status === 'completed' ? 'pending' : 'completed' },
    { new: true }
  );

  return res.status(200).json({
    status: 'success',
    message: 'Todo updated successfully',
    data: updatedTodo,
  });
};

const deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  const deletedTodo = await Todo.findByIdAndDelete(todoId);
  if (!deletedTodo) {
    return res.status(404).json({
      status: 'failure',
      message: 'Todo not found',
    });
  }

  await SubTask.deleteMany({ _id: { $in: deletedTodo.subTasks } });

  return res.status(200).json({
    status: 'success',
    message: 'Todo deleted successfully',
    data: deletedTodo,
  });
};

const reorderTodos = async (req, res) => {
  const { reorderedTodos } = req.body;

  const bulkUpdates = reorderedTodos.map((todo) => ({
    updateOne: {
      filter: { _id: todo._id },
      update: { order: todo.order },
    },
  }));

  await Todo.bulkWrite(bulkUpdates);

  return res.status(200).json({
    status: 'success',
    message: 'Todos reordered successfully',
  });
};

const assignTodoToUser = async (req, res) => {
  const { selectedUsers } = req.body;
  const { todoId } = req.params;

  const updatedTask = await Todo.findByIdAndUpdate(
    todoId,
    { $set: { assigneeIds: selectedUsers } },
    { new: true }
  );

  if (!updatedTask) {
    return res.status(404).json({
      status: 'failure',
      message: 'Todo not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Todo assigned successfully',
    data: updatedTask,
  });
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleStatusTodo,
  deleteTodo,
  reorderTodos,
  assignTodoToUser,
};
