import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Bug, FileText, BarChart3, Settings, LogOut, ChevronDown, Shield, Building2, UserCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDeptAuth } from '../context/DeptAuthContext';
import { toast } from 'react-toastify';
import LogoutModal from './LogoutModal';

const DepartmentAdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { deptAdmin, logout } = useDeptAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveItem(path);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileMenu((prev) => !prev);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dept/dashboard' },
    { id: 'tickets', label: 'Department Tickets', icon: Bug, path: '/dept/tickets' },
    { id: 'ticket-assigned', label: 'Ticket Assigned', icon: UserCheck, path: '/dept/ticket-assigned' },
    { id: 'reports', label: 'Department Reports', icon: BarChart3, path: '/dept/reports' },
    { id: 'department-info', label: 'Department Info', icon: Building2, path: '/dept/department-info' },
    {
      id: 'profile',
      label: (
        <div className="flex flex-col">
          <span>{deptAdmin?.name || 'John Doe'}</span>
          <span className="text-sm text-gray-500">{deptAdmin?.department || 'IT Department'}</span>
        </div>
      ),
      icon: Shield,
      hasSubmenu: true,
      submenu: [
        { id: 'viewProfile', label: 'View Profile', icon: Users, path: '/dept/profile/view' },
        { id: 'changePassword', label: 'Change Password', icon: FileText, path: '/dept/profile/change-password' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-white"/>
            </div>
            <span className="text-xl font-bold text-gray-800">Dept Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              if (item.hasSubmenu) {
                return (
                  <div key={item.id} ref={profileMenuRef}>
                    <div
                      onClick={handleProfileClick}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                        showProfileMenu ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} className="text-gray-500" />
                        <div className="flex flex-col">
                          <span className="font-medium">{deptAdmin?.name || 'John Doe'}</span>
                          {deptAdmin?.department && (
                            <span className="text-sm text-gray-500">{deptAdmin.department}</span>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transform transition-transform duration-200 ${
                          showProfileMenu ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Submenu */}
                    {showProfileMenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={subItem.path}
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <subItem.icon size={18} />
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={20} className="text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default DepartmentAdminSidebar;