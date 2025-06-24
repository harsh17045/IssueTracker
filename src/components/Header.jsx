import { Menu, Search, Filter, Bell, User, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfile } from '../services/authService';

const Header = ({ onMenuClick }) => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profileData = await getProfile();
        setProfileImage(profileData?.profile_image || null);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
            {/* <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#4B2D87] text-white text-xs rounded-full flex items-center justify-center">
              12
            </span> */}
          </button>
          
          <div 
            onClick={handleProfileClick}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            
            <div className="w-8 h-8 bg-[#4B2D87] rounded-full flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={18} className="text-white" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {employee?.name || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;