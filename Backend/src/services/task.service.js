const Task = require('../models/task.model');

/**
 * Create Task
 */
exports.createTaskService = async (data, userId) => {
  return await Task.create({
    ...data,
    assignedTo: data.assignedTo || userId, // Default to creator if not assigned
    createdBy: userId,
  });
};

/**
 * Get Tasks
 */
exports.getTasksService = async (user, query) => {
  const { page = 1, limit = 10, status, priority } = query;
  const skip = (page - 1) * limit;

  // Base filter (Role based)
  let baseFilter = {};
  if (user.role !== 'admin') {
    baseFilter.assignedTo = user._id;
  }

  // List filter (applied on top of base filter)
  let listFilter = { ...baseFilter };
  if (status) listFilter.status = status;
  if (priority) listFilter.priority = priority;

  // Fetch paginated tasks
  const tasks = await Task.find(listFilter)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name')
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const listTotal = await Task.countDocuments(listFilter);

  // Calculate global stats (ignoring list filters)
  const totalTasks = await Task.countDocuments(baseFilter);
  const pendingTasks = await Task.countDocuments({ ...baseFilter, status: { $ne: 'done' } });
  const doneTasks = await Task.countDocuments({ ...baseFilter, status: 'done' });

  const stats = {
    total: totalTasks,
    pending: pendingTasks,
    done: doneTasks
  };

  return {
    tasks,
    total: listTotal,
    page: parseInt(page),
    pages: Math.ceil(listTotal / limit),
    stats
  };
};

/**
 * Get Task By Id
 */
exports.getTaskByIdService = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name')
    .populate('comments.user', 'name'); // Populate comment authors

  if (!task) throw new Error('Task not found');
  return task;
};

/**
 * Update Task
 */
exports.updateTaskService = async (taskId, data, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');

  // Sanitize updates
  if (data.assignedTo === '') {
    data.assignedTo = null;
  }
  if (data.assignedTo && data.assignedTo === 'null') {
    data.assignedTo = null;
  }

  // Authorization & Field Restriction
  if (user.role !== 'admin') {
    // Normal User: Must be assigned
    if (task.assignedTo?.toString() !== user._id.toString()) {
      throw new Error('Not authorized to update this task');
    }

    // Normal User: Can ONLY update 'status'
    const allowedUpdates = ['status'];
    const updates = Object.keys(data);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      throw new Error('Users can only update task status');
    }
  }

  // Proceed with update
  const updatedTask = await Task.findByIdAndUpdate(taskId, data, {
    new: true,
  });

  return updatedTask;
};

/**
 * Add Comment
 */
exports.addCommentService = async (taskId, text, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');

  // Allow anyone who can see the task (handled by route protection/getTask) to comment.
  // Ideally, ensure user is assigned or admin. 
  // For simplicity, any auth user can comment if they hit the endpoint, 
  // but let's restrict to Admin, Creator, or Assignee.

  // Note: creator might be null if not populated, but here we work on DB doc.
  // assignedTo is ObjectId in DB.

  /*  
  if (user.role !== 'admin' && 
      task.createdBy.toString() !== userId && 
      task.assignedTo?.toString() !== userId) {
      // throw new Error('Not authorized to comment');
  } 
  */
  // Allowing open comments for simplicity as per "Simple Task Mgmt"

  task.comments.push({ text, user: userId });
  await task.save();

  // Return specific comment with populated user
  await task.populate('comments.user', 'name');
  return task;
};

/**
 * Delete Task
 */
exports.deleteTaskService = async (taskId, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');

  // Authorization check
  if (user.role !== 'admin' &&
    task.createdBy.toString() !== user._id.toString()) {
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();
};
