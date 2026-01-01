import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import taskService from '../services/taskService';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaUserCircle, FaClock, FaEdit, FaArrowLeft, FaCheckCircle, FaSpinner, FaAlignLeft } from 'react-icons/fa';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTask(id);
      setTask(data);
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
      try {
          await taskService.updateTask(id, { status: newStatus });
          setTask({ ...task, status: newStatus });
          toast.success("Status updated");
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update status");
      }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
        case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
        case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        default: return 'bg-gray-100';
    }
  }

  const getStatusColor = (status) => {
    return status === 'done' ? 'bg-emerald-100 text-emerald-800' : 
           status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  }

  if (loading) return (
      <Layout>
          <div className="flex justify-center items-center min-h-[50vh]">
              <FaSpinner className="animate-spin text-4xl text-indigo-600" />
          </div>
      </Layout>
  );

  if (!task) return <Layout><div>Task not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6">
             <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium text-sm">
                <FaArrowLeft /> Back to Dashboard
            </Link>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex gap-2 mb-3">
                         <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border ${getPriorityColor(task.priority)}`}>
                            {task.priority} Priority
                        </span>
                         <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
                        <div className="flex items-center gap-2">
                             <span className="font-medium text-gray-700">Assignee:</span> {task.assignedTo?.name || 'Unassigned'}
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="font-medium text-gray-700">Due:</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                        </div>
                    </div>
                </div>
                {user.role === 'admin' && (
                    <Link to={`/tasks/${task._id}/edit`}>
                        <Button variant="secondary" className="flex items-center gap-2 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 text-sm">
                             Edit
                        </Button>
                    </Link>
                )}
            </div>

            <div className="p-6 md:p-8">
                <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
                     <div className="bg-gray-50 p-4 rounded-md border border-gray-100 whitespace-pre-wrap">
                        {task.description || <span className="italic text-gray-400">No description provided.</span>}
                     </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Update Status</h3>
                    <div className="flex gap-3">
                         {['todo', 'in-progress', 'done'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(status)}
                                    disabled={task.status === status}
                                    className={`
                                        px-4 py-2 rounded-md text-sm font-medium border transition-colors
                                        ${task.status === status 
                                            ? (status === 'done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200')
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                                </button>
                            ))}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        Comments <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{task.comments?.length || 0}</span> 
                    </h3>
                    
                    <div className="space-y-6 mb-8">
                        {task.comments?.map((comment, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs flex-shrink-0">
                                    {comment.user?.name?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 text-sm">{comment.user?.name || 'Unknown'}</span>
                                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {(!task.comments || task.comments.length === 0) && (
                            <p className="text-gray-500 italic text-sm">No comments yet.</p>
                        )}
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs flex-shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <form 
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const text = e.target.comment.value;
                                if(!text.trim()) return;
                                try {
                                    await taskService.addComment(task._id, text);
                                    e.target.reset();
                                    fetchTask();
                                    toast.success('Comment added');
                                } catch(err) {
                                    toast.error('Failed to add comment');
                                }
                            }} 
                            className="flex-1"
                        >
                            <textarea 
                                name="comment"
                                placeholder="Add a comment..." 
                                className="w-full bg-white border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-y min-h-[80px]"
                            ></textarea>
                            <div className="flex justify-end mt-2">
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetails;
