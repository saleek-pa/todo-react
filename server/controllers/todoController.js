const SubTask = require('../models/subTaskModel');
const Todo = require('../models/todoModel');

const getAllTodos = async (req, res) => {
  const { priorities, searchTerm } = req.query;

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

  const [result] = await Todo.aggregate([
    {
      $lookup: {
        from: 'subtasks',
        localField: 'subTasks',
        foreignField: '_id',
        as: 'subTasks',
      },
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
      $match: filterConditions,
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
  ]);

  return res.status(200).json({
    status: 'success',
    message: 'Todos retrieved successfully',
    data: result,
  });
};

const createTodo = async (req, res) => {
  const todoData = req.body;

  const minOrderTodo = await Todo.findOne().sort({ order: 1 });
  const newOrder = minOrderTodo ? minOrderTodo.order - 1 : 1;

  const newTodo = await Todo.create({
    ...todoData,
    order: newOrder,
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

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleStatusTodo,
  deleteTodo,
  reorderTodos,
};
