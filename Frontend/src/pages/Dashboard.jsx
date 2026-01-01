import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaPlus,
  FaFilter,
  FaCalendarAlt,
  FaUserCircle,
  FaUserShield,
  FaCheckCircle,
  FaClock,
  FaLayerGroup
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', priority: '' });
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, pending: 0, done: 0 });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks);
      setTotalPages(data.pages);
      // Use real stats from backend
      if (data.stats) {
          setStats(data.stats);
      } else {
          // Fallback if backend doesn't return stats (should not happen after update)
          setStats({ total: 0, pending: 0, done: 0 });
      }
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusColor = (status) => {
    return status === 'done' ? 'text-emerald-700 bg-emerald-100' :
      status === 'in-progress' ? 'text-blue-700 bg-blue-100' : 'text-gray-700 bg-gray-100';
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Here's what's happening with your projects today.</p>
          </div>
          {user.role === 'admin' && (
            <div className="flex gap-3">
              <Link to="/admin/users">
                <Button variant="secondary" className="shadow-sm border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
                   Manage Users
                </Button>
              </Link>
              <Link to="/tasks/new">
                <Button className="shadow-lg shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700">
                   Create Task
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Completed</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.done}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Content */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Filter Tasks</span>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full md:w-40 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full md:w-40 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="font-medium text-gray-500">Loading tasks...</div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-bold text-gray-900">No tasks found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters or create a new task.</p>
                <button 
                  onClick={() => setFilters({ ...filters, status: '', priority: '' })} 
                  className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <div key={task._id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className={`w-2.5 h-2.5 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    </div>

                    <Link to={`/tasks/${task._id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {task.description || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-semibold">Due:</span>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                      </div>
                      <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">
                              {task.assignedTo?.name || 'Unassigned'}
                          </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Link to={`/tasks/${task._id}`} className="flex-1">
                        <Button variant="secondary" className="w-full text-xs py-2 h-8">View</Button>
                      </Link>
                      {(user.role === 'admin' || task.createdBy === user._id) && (
                        <button 
                          onClick={() => handleDelete(task._id)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-bold transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <button 
                onClick={() => handlePageChange(filters.page - 1)} 
                disabled={filters.page === 1}
                className="text-gray-500 hover:text-indigo-600 disabled:opacity-50 font-medium text-sm transition-colors"
             >
                Previous
             </button>
             <span className="text-sm font-medium text-gray-600">
                Page {filters.page} of {totalPages}
             </span>
             <button 
                onClick={() => handlePageChange(filters.page + 1)} 
                disabled={filters.page === totalPages}
                className="text-gray-500 hover:text-indigo-600 disabled:opacity-50 font-medium text-sm transition-colors"
             >
                Next
             </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
