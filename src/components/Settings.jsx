import { useState } from 'react';
import { AlertCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { employee, setEmployee } = useAuth();
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    department: employee?.department || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ["HR", "Admin", "Finance", "Marketing", "IT"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with actual API call
      console.log('Updating profile:', formData);
      setEmployee({ ...employee, name: formData.name, department: formData.department });
      alert('Profile updated successfully!');
    } catch {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4B2D87]">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile settings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        {errors.general && (
          <p className="text-red-600 mb-3 flex items-center text-sm">
            <AlertCircle size={14} className="mr-1" /> {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full py-3 pl-10 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
                }`}
                placeholder="Your full name"
              />
            </div>
            {errors.name && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.name}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full py-3 px-4 border rounded-full focus:outline-none focus:ring-2 ${
                errors.department ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.department}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-full text-white font-medium transition-all ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4B2D87] hover:bg-[#5E3A9F]'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;