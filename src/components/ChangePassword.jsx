import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add password change logic here
    toast.success('Password changed successfully');
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <div className="mt-1 relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-[#4B2D87] focus:border-[#4B2D87]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="mt-1 relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-[#4B2D87] focus:border-[#4B2D87]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="mt-1 relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-[#4B2D87] focus:border-[#4B2D87]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#4B2D87] rounded-lg hover:bg-[#5E3A9F] focus:outline-none"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;