import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Bug, 
  FileText, 
  Settings, 
  LogOut, 
  X,
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { employee } = useAuth(); // Removed logout from useAuth
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');

  // Sync active item with current route
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setActiveItem(path);
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'raiseTicket', label: 'Raise Ticket', icon: FileText, path: '/raise-ticket' },
    { id: 'myTickets', label: 'My Tickets', icon: Bug, path: '/my-tickets' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    navigate('/logout'); // Changed to redirect to logout page instead of direct logout
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#4B2D87] shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto rounded-r-3xl`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#5E3A9F]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Bug className="text-[#4B2D87]" size={18} />
            </div>
            <span className="text-xl font-bold text-white">IssueTracker</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-[#5E3A9F]"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeItem === item.id
                      ? 'bg-[#5E3A9F] text-white'
                      : 'text-white hover:bg-[#5E3A9F]'
                  }`}
                >
                  <Icon size={20} className="text-white" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#5E3A9F]">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#5E3A9F] cursor-pointer">
            <div className="w-10 h-10 bg-[#5E3A9F] rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{employee?.name || 'User'}</p>
              <p className="text-xs text-gray-300">Department - {employee?.department || 'Department'}</p>
            </div>
            <ChevronDown size={16} className="text-white" />
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 mt-2 text-white hover:bg-[#5E3A9F] rounded-lg transition-colors"
          >
            <LogOut size={20} className="text-white" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

