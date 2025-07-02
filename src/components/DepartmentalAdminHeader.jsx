import { Bell, User, Menu, X } from 'lucide-react';
import { useDeptAuth } from '../context/DeptAuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';

const DepartmentAdminHeader = ({ onMenuClick }) => {
  const { deptAdmin } = useDeptAuth();
  const { unreadCount, notifications, showNotificationPanel, toggleNotificationPanel, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const handleProfileClick = () => {
    navigate('/dept/profile');
  };

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        toggleNotificationPanel();
      }
    };

    if (showNotificationPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationPanel, toggleNotificationPanel]);

  // Add debug log for notifications
  console.log("Current notifications:", notifications);
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
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={toggleNotificationPanel}
            className="relative p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotificationPanel && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.ticketId) {
                          navigate(`/dept/tickets/${notification.ticketId}`);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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