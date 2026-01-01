const asyncHandler = require('../middlewares/asyncHandler');
const mongoose = require('mongoose');

const {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  addCommentService,
} = require('../services/task.service');

exports.createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Task created',
    task,
  });
});

exports.getTasks = asyncHandler(async (req, res) => {
  const { tasks, total, page, pages, stats } = await getTasksService(req.user, req.query);

  res.json({
    success: true,
    count: tasks.length,
    total, // This is listTotal (filtered)
    page,
    pages,
    stats, // This is global stats (Total, Pending, Done)
    tasks,
  });
});

exports.getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error('Task not found (Invalid ID)');
  }

  const task = await getTaskByIdService(id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.status(200).json(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const task = await updateTaskService(req.params.id, req.body, req.user);

  res.json({
    success: true,
    message: 'Task updated',
    task,
  });
});

exports.addComment = asyncHandler(async (req, res) => {
  const task = await addCommentService(req.params.id, req.body.text, req.user._id);

  res.json({
    success: true,
    message: 'Comment added',
    task,
  });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  await deleteTaskService(req.params.id, req.user);

  res.json({
    success: true,
    message: 'Task deleted',
  });
});
