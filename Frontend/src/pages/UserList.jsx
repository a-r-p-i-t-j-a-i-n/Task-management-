import { useState, useEffect } from 'react';
import userService from '../services/userService';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';
import { FaUserPlus, FaTrash, FaUserShield, FaUser, FaEnvelope, FaLock, FaUsers } from 'react-icons/fa';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
      try {
          await userService.deleteUser(id);
          toast.success("User deleted successfully");
          setUsers(users.filter(u => u._id !== id));
      } catch (error) {
          toast.error("Failed to delete user");
      }
  }

  const handleAddUser = async (e) => {
      e.preventDefault();
      try {
          const res = await userService.createUser(newUser);
          toast.success("User created successfully");
          setUsers([...users, res.user]);
          setNewUser({ name: '', email: '', password: '', role: 'user' });
      } catch (error) {
           toast.error(error.response?.data?.message || "Failed to create user");
      }
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: List */}
        <div className="flex-1">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team Members</h1>
                <p className="text-gray-500 text-sm mt-1">Manage user access and roles.</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="3" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                            ) : users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${user.role === 'admin' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-800 text-xs font-bold hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Column: Add User Form */}
        <div className="w-full lg:w-[350px]">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Member</h2>
                
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                            type="text"
                            value={newUser.name} 
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                            required 
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email"
                            value={newUser.email} 
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                            required 
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                         <input 
                            type="password"
                            value={newUser.password} 
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                            required 
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <Button type="submit" className="w-full py-2 mt-2">
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserList;
