import { User, Mail, Building2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { employee } = useAuth();

  if (!employee) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-red-500">No user data found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-[#4B2D87] rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1 relative">
                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={employee?.name || ''}
                  disabled
                  className="pl-10 w-full py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={employee?.email || ''}
                  disabled
                  className="pl-10 w-full py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <div className="mt-1 relative">
                <Building2 className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={employee?.department || ''}
                  disabled
                  className="pl-10 w-full py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <div className="mt-1 relative">
                <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={employee?.contact || ''}
                  disabled
                  className="pl-10 w-full py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;