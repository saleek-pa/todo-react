const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleStatusTodo,
  deleteTodo,
} = require('../controllers/todoController');
const router = express.Router();

router.get('/todos', tryCatch(getAllTodos));
router.post('/todos', tryCatch(createTodo));
router.put('/todos/:id', tryCatch(updateTodo));
router.patch('/todos/:id', tryCatch(toggleStatusTodo));
router.delete('/todos/:id', tryCatch(deleteTodo));

module.exports = router;
