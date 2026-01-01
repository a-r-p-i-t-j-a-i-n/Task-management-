import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTasks, FaUserShield, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg font-bold">T</span>
              TaskFlow
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                   <div className="text-sm font-bold text-gray-900">{user.name}</div>
                   <div className="text-xs text-gray-500 font-medium capitalize">{user.role}</div>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                  Log in
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
