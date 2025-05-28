import { useState, useEffect } from 'react';
import { User, Mail, Building2, Phone, Loader2, Briefcase, Building, LayoutGrid, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../services/authService';

const Profile = () => {
  const { employee } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData) {
      setEditedData(profileData);
    }
  }, [profileData]);

  const handleSave = async () => {
    try {
      console.log("Saving profile data:", editedData);
      const updatedProfile = await updateProfile(editedData);
      setProfileData(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const validateAndConvertField = (field, value) => {
    switch (field) {
      case 'lab_no': {
        // Allow empty string for backspacing
        if (value === '') return '';
        const num = parseInt(value);
        // Only validate if it's a valid number
        if (!isNaN(num)) {
          return Math.max(1, num); // Minimum value of 1
        }
        return '';
      }
      case 'floor': {
        if (value === '') return '';
        const num = parseInt(value);
        if (!isNaN(num)) {
          return Math.max(0, num); // Minimum value of 0
        }
        return '';
      }
      default:
        return value;
    }
  };

  const renderField = (label, value, icon, field) => {
    const Icon = icon;
    return (
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
        {isEditing ? (
          <div className="relative">
            <Icon className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type={field === 'floor' || field === 'lab_no' ? 'number' : 'text'}
              value={editedData[field] || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                // Allow direct input manipulation
                setEditedData(prev => ({
                  ...prev,
                  [field]: newValue === '' ? '' : validateAndConvertField(field, newValue)
                }));
              }}
              onBlur={(e) => {
                // Validate on blur to ensure final value meets requirements
                const validatedValue = validateAndConvertField(field, e.target.value);
                setEditedData(prev => ({
                  ...prev,
                  [field]: validatedValue === '' ? (field === 'lab_no' ? 1 : 0) : validatedValue
                }));
              }}
              min={field === 'lab_no' ? 1 : 0}
              className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
            />
          </div>
        ) : (
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <Icon className="text-gray-400 mr-3" size={20} />
            <span className="text-gray-700">{value || 'N/A'}</span>
          </div>
        )}
      </div>
    );
  };

  if (!employee) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-red-500">No user data found. Please log in again.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-[#4B2D87]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-[#4B2D87] rounded-xl shadow-md p-8 mb-6 relative">
          {/* Edit/Save/Cancel Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 group"
                >
                  <Check size={20} className="text-white" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 group"
                >
                  <X size={20} className="text-white" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              >
                <Edit2 size={20} className="text-[#4B2D87] group-hover:text-[#5E3A9F]" />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-[#4B2D87]" />
            </div>
            <h1 className="text-2xl font-bold text-white">{profileData?.name || 'Loading...'}</h1>
            <p className="text-gray-300 mt-1">{profileData?.email || 'Loading...'}</p>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User size={24} className="mr-3 text-[#4B2D87]" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderField('Department', profileData?.department, Briefcase, 'department')}
            {renderField('Contact', profileData?.contact_no, Phone, 'contact_no')}
          </div>
        </div>

        {/* Location Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Building size={24} className="mr-3 text-[#4B2D87]" />
            Location Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {renderField('Building', profileData?.building, Building2, 'building')}
            {renderField('Floor', profileData?.floor, LayoutGrid, 'floor')}
            {renderField('Lab Number', profileData?.lab_no, Building, 'lab_no')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;