import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Layout;
