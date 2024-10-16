const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const {
  getAllTodos,
  createTodo,
  updateTodo,
  reorderTodos,
  toggleStatusTodo,
  deleteTodo,
} = require('../controllers/todoController');
const router = express.Router();

router
  .get('/', tryCatch(getAllTodos))
  .post('/', tryCatch(createTodo))
  .put('/reorder', tryCatch(reorderTodos))
  .put('/:todoId', tryCatch(updateTodo))
  .patch('/:todoId', tryCatch(toggleStatusTodo))
  .delete('/:todoId', tryCatch(deleteTodo));

module.exports = router;
