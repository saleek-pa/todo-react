const Todo = require('../models/todoModel');
const SubTask = require('../models/subTaskModel');

const addSubtask = async (req, res) => {
  const { todoId } = req.params;
  const { title } = req.body;

  const todo = await Todo.findById(todoId).populate('subTasks');
  if (!todo) {
    return res.status(404).json({
      status: 'failure',
      message: 'Todo not found',
    });
  }

  const currentSubTasksCount = todo.subTasks.length;
  const newOrder = currentSubTasksCount + 1;

  const newSubTask = await SubTask.create({ title, order: newOrder });
  todo.subTasks.push(newSubTask._id);
  await todo.save();

  return res.status(201).json({
    status: 'success',
    message: 'Subtask added successfully',
    data: todo,
  });
};

const updateSubTask = async (req, res) => {
  const { subtaskId } = req.params;
  const { title } = req.body;

  const updatedSubTask = await SubTask.findByIdAndUpdate(
    subtaskId,
    { $set: { title } },
    { new: true }
  );

  if (!updatedSubTask) {
    return res.status(404).json({
      status: 'failure',
      message: 'Subtask not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Subtask title updated successfully',
    data: updatedSubTask,
  });
};

const toggleSubtask = async (req, res) => {
  const { subtaskId } = req.params;

  const subtask = await SubTask.findById(subtaskId);
  if (!subtask) {
    return res.status(404).json({
      status: 'failure',
      message: 'Subtask not found',
    });
  }

  subtask.completed = !subtask.completed;
  await subtask.save();

  return res.status(200).json({
    status: 'success',
    message: 'Subtask status updated successfully',
    data: subtask,
  });
};

const deleteSubtask = async (req, res) => {
  const { todoId, subtaskId } = req.params;

  await SubTask.findByIdAndDelete(subtaskId);
  const updatedTodo = await Todo.findByIdAndUpdate(
    todoId,
    { $pull: { subTasks: subtaskId } },
    { new: true }
  );

  if (!updatedTodo) {
    return res.status(404).json({
      status: 'failure',
      message: 'Todo not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Subtask deleted successfully',
    data: updatedTodo,
  });
};

const reorderSubtask = async (req, res) => {
  const { reorderedSubtasks } = req.body;

  const bulkUpdates = reorderedSubtasks.map((subTask) => ({
    updateOne: {
      filter: { _id: subTask._id },
      update: { order: subTask.order },
    },
  }));

  await SubTask.bulkWrite(bulkUpdates);

  return res.status(200).json({
    status: 'success',
    message: 'Todos reordered successfully',
  });
};

module.exports = { addSubtask, updateSubTask, toggleSubtask, deleteSubtask, reorderSubtask };
