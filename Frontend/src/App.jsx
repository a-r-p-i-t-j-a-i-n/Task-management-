import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import TaskDetails from './pages/TaskDetails';
import UserList from './pages/UserList';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute roles={['admin']} />}>
             <Route path="/tasks/new" element={<TaskForm />} />
             <Route path="/tasks/:id/edit" element={<TaskForm />} />
             <Route path="/admin/users" element={<UserList />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
