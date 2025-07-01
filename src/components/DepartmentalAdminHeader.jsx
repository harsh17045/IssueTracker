import { Bell, User, Menu } from 'lucide-react';
import { useDeptAuth } from '../context/DeptAuthContext';
import { useNavigate } from 'react-router-dom';

const DepartmentAdminHeader = ({ onMenuClick }) => {
  const { deptAdmin } = useDeptAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/dept/profile');
  };

  return (
    <header className="fixed top-0 right-0 lg:left-64 h-16 bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between z-40">
      {/* Left Section - Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-200"
      >
        <Menu size={20} />
      </button>

      {/* Center Section - Department Info */}
      {/* */}

      {/* Right Section */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-200 rounded-full">
          <Bell size={20} />
        </button>

        {/* Profile Section */}
        <div
          onClick={handleProfileClick}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
            <User size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {deptAdmin?.name || 'John Doe'}
            </span>
            <span className="text-xs text-gray-500 lg:hidden">
              {deptAdmin?.department || 'IT Department'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DepartmentAdminHeader;