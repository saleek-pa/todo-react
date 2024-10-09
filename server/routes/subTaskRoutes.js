const express = require('express');
const tryCatch = require('../middlewares/tryCatch');
const {
  addSubtask,
  updateSubTask,
  toggleSubtask,
  deleteSubtask,
} = require('../controllers/subTaskController');
const router = express.Router();

router.post('/todos/:todoId/subtasks', tryCatch(addSubtask));
router.put('/todos/:todoId/subtasks/:subtaskId', tryCatch(updateSubTask));
router.patch('/todos/:todoId/subtasks/:subtaskId', tryCatch(toggleSubtask));
router.delete('/todos/:todoId/subtasks/:subtaskId', tryCatch(deleteSubtask));

module.exports = router;
