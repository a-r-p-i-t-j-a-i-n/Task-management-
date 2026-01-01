const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment
} = require('../controllers/task.controller');

const protect = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(protect);

router.post('/', authorize('admin'), createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/:id/comments', protect, addComment);

module.exports = router;
