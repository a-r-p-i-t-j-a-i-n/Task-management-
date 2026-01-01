import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-indigo-900/50 backdrop-blur-sm"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-indigo-200">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="you@example.com"
            />
            <Input 
              label="Password" 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
            />
            
            <Button type="submit" className="w-full flex justify-center py-3">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New here?
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
               <Link to="/register">
                 <Button variant="secondary" className="w-full">Create an account</Button>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
