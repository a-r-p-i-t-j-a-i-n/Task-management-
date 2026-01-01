import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import userService from '../services/userService';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaTasks, FaCalendarAlt, FaAlignLeft, FaFlag, FaUserCircle, FaSpinner } from 'react-icons/fa';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    assignedTo: '' // User ID
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Restrict access: Only Admins can create tasks.
    if (!isEditMode && user.role !== 'admin') {
      toast.error('Only Admins can create tasks');
      navigate('/');
      return;
    }

    if (isEditMode) {
      fetchTask();
    }
    
    if (user.role === 'admin') {
      fetchUsers();
    }
  }, [id, user.role]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data.users || []);
    } catch (error) {
       console.error("Failed to load users");
    }
  };

  const fetchTask = async () => {
    try {
      const task = await taskService.getTask(id);
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo?._id || ''
      });
    } catch (error) {
      toast.error('Failed to load task data');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await taskService.updateTask(id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created successfully');
      }
      navigate('/');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Standard Form Layout
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows={4}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input 
                            type="date"
                            name="dueDate" 
                            value={formData.dueDate} 
                            onChange={handleChange} 
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {user.role === 'admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                            <select 
                                name="assignedTo" 
                                value={formData.assignedTo} 
                                onChange={handleChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
                            >
                                <option value="">Select Team Member</option>
                                {users.map(u => (
                                  <option key={u._id} value={u._id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                     <button 
                        type="button" 
                        onClick={() => navigate('/')}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancel
                     </button>
                     <Button type="submit" disabled={loading} className="px-6 py-2">
                        {loading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
                     </Button>
                </div>

            </form>
        </div>
      </div>
    </Layout>
  );
};

export default TaskForm;
