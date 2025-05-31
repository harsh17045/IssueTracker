import { useEffect, useState } from "react";
import { User, Mail, Building2, Phone, Loader2, Briefcase, Building, LayoutGrid, Edit2, Check, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../services/authService';

const Profile = () => {
  const { employee, setEmployee } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const buildings = ["Academic", "Management", "Research"];
  const departments = ["HR", "Admin", "Finance", "Marketing", "IT"];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
        setEditedData(data);
        setProfileImage(data?.profile_image || null); // Use profile_image from backend
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file); // Store file for upload
    }
  };

  const handleSave = async () => {
  try {
    const formData = new FormData();

    // Always send all fields, using editedData if present, else profileData
    formData.append('name', editedData.name ?? profileData.name ?? '');
    formData.append('contact_no', editedData.contact_no ?? profileData.contact_no ?? '');
    formData.append('building', editedData.building ?? profileData.building ?? '');
    formData.append('department', editedData.department ?? profileData.department ?? '');
    formData.append('floor', 
      (editedData.floor !== undefined && editedData.floor !== null && editedData.floor !== '') 
        ? editedData.floor.toString() 
        : (profileData.floor ?? 0).toString()
    );
    formData.append('lab_no', 
      (editedData.lab_no !== undefined && editedData.lab_no !== null && editedData.lab_no !== '') 
        ? editedData.lab_no.toString() 
        : (profileData.lab_no ?? 1).toString()
    );

    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const updatedProfile = await updateProfile(formData, true);
    
    setProfileData(updatedProfile);
    setProfileImage(updatedProfile?.profile_image || null);
    setEmployee(updatedProfile); // <-- This line is critical!
    setIsEditing(false);
    setImageFile(null);
    toast.success('Profile updated successfully');
  } catch (err) {
    console.error('Update error:', err);
    toast.error(err.message || 'Failed to update profile');
  }
};

  const handleCancel = () => {
    setEditedData(profileData);
    setProfileImage(profileData?.profile_image || null);
    setIsEditing(false);
    setImageFile(null);
  };

  const validateAndConvertField = (field, value) => {
    switch (field) {
      case 'lab_no': {
        if (value === '') return '';
        const num = parseInt(value);
        if (!isNaN(num)) {
          return Math.max(1, num);
        }
        return '';
      }
      case 'floor': {
        if (value === '') return '';
        const num = parseInt(value);
        if (!isNaN(num)) {
          return Math.max(0, num);
        }
        return '';
      }
      default:
        return value;
    }
  };

  const renderField = (label, value, icon, field) => {
    const Icon = icon;
    const isDropdown = field === 'building' || field === 'department';

    return (
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
        {isEditing ? (
          <div className="relative">
            <Icon className="absolute top-3 left-3 text-gray-400" size={20} />
            {isDropdown ? (
              <div className="relative">
                <select
                  value={editedData[field] || ''}
                  onChange={(e) => {
                    setEditedData(prev => ({
                      ...prev,
                      [field]: e.target.value
                    }));
                  }}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                >
                  <option value="">Select {label}</option>
                  {field === 'building' && buildings.map(building => (
                    <option key={building} value={building}>
                      {building}
                    </option>
                  ))}
                  {field === 'department' && departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={20} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                />
              </div>
            ) : (
              <input
                type={field === 'floor' || field === 'lab_no' ? 'number' : 'text'}
                value={editedData[field] || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setEditedData(prev => ({
                    ...prev,
                    [field]: newValue === '' ? '' : validateAndConvertField(field, newValue)
                  }));
                }}
                onBlur={(e) => {
                  const validatedValue = validateAndConvertField(field, e.target.value);
                  setEditedData(prev => ({
                    ...prev,
                    [field]: validatedValue === '' ? (field === 'lab_no' ? 1 : 0) : validatedValue
                  }));
                }}
                min={field === 'lab_no' ? 1 : 0}
                className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
              />
            )}
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
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 relative overflow-hidden group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={40} className="text-[#4B2D87]" />
              )}
              {isEditing && (
                <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <span className="text-white text-xs">Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
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