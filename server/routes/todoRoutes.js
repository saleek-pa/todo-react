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

router.get('/todos', tryCatch(getAllTodos));
router.post('/todos', tryCatch(createTodo));
router.put('/todos/reorder', tryCatch(reorderTodos));
router.put('/todos/:todoId', tryCatch(updateTodo));
router.patch('/todos/:todoId', tryCatch(toggleStatusTodo));
router.delete('/todos/:todoId', tryCatch(deleteTodo));

module.exports = router;
