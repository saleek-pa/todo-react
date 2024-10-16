const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const {
  addSubtask,
  updateSubTask,
  toggleSubtask,
  deleteSubtask,
  reorderSubtask,
} = require('../controllers/subTaskController');
const router = express.Router();

router
  .post('/:todoId/subtasks', tryCatch(addSubtask))
  .put('/:todoId/subtasks/reorder', tryCatch(reorderSubtask))
  .put('/:todoId/subtasks/:subtaskId', tryCatch(updateSubTask))
  .patch('/:todoId/subtasks/:subtaskId', tryCatch(toggleSubtask))
  .delete('/:todoId/subtasks/:subtaskId', tryCatch(deleteSubtask));

module.exports = router;
