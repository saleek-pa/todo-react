const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const {
  getAllTodos,
  createTodo,
  updateTodo,
  reorderTodos,
  toggleStatusTodo,
  deleteTodo,
  assignTodoToUser,
} = require('../controllers/todoController');
const router = express.Router();

router
  .get('/', tryCatch(getAllTodos))
  .post('/', tryCatch(createTodo))
  .put('/reorder', tryCatch(reorderTodos))
  .put('/:todoId', tryCatch(updateTodo))
  .patch('/:todoId', tryCatch(toggleStatusTodo))
  .delete('/:todoId', tryCatch(deleteTodo))
  .post('/:todoId/assign', tryCatch(assignTodoToUser));

module.exports = router;
