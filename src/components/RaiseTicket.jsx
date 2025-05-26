import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { raiseTicket } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = [
  { id: 'HR', name: 'HR' },
  { id: 'Admin General', name: 'Admin General' },
  { id: 'Admin IT', name: 'Admin IT' },
];

const RaiseTicket = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    from_department: employee?.department || '', // Employee's department ID
    priority: 'normal', // Set default priority to Normal
    raisedBy: employee?.employeeId || '', // Employee ID
    to_department: '', // Department ID to assign the Ticket to
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Required field validations with trim() to check for empty strings
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Only validate to_department since from_department is auto-set
    if (!formData.to_department) {
      newErrors.to_department = 'Please select a department';
    }
    
    // Priority validation - only if not set to default 'Normal'
    if (!formData.priority) {
      newErrors.priority = 'Please select a priority';
    }
    
    // Don't validate from_department and raisedBy as they're auto-populated
    // from employee context
    
    console.log('Validation errors:', newErrors); // Add this for debugging
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Hello");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Hello");
    setIsSubmitting(true);
    try {
      console.log('Submitting ticket data:', formData); // Add logging
      const response = await raiseTicket(formData);
      console.log('Server response:', response); // Add logging

      if (response.message==='Ticket raised successfully') { // Changed condition
        alert('Ticket raised successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          from_department: employee?.department || '',
          priority: 'normal',
          raisedBy: employee?.employeeId || '',
          to_department: '',
        });
        navigate('/my-tickets'); // Redirect to My Issues page
      } else {
        throw new Error(response?.message || 'Failed to raise ticket');
      }
    } catch (error) {
      console.error('Error raising ticket:', error); // Add error logging
      setErrors({ 
        general: error.message || 'Failed to raise ticket. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4B2D87]">Raise a New Ticket</h1>
          <p className="text-gray-600 mt-1">Submit a new ticket for review</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        {errors.general && (
          <p className="text-red-600 mb-3 flex items-center text-sm">
            <AlertCircle size={14} className="mr-1" /> {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full py-3 px-4 border rounded-full focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
              placeholder="Enter Ticket title"
            />
            {errors.title && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
              placeholder="Describe the Ticket in detail"
              rows="5"
            />
            {errors.description && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.description}
              </p>
            )}
          </div>

          {/* From Department (Non-editable, displays employee's department) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Department</label>
            <input
              type="text"
              value={employee?.department || 'Not assigned'}
              disabled
              className="w-full py-3 px-4 border rounded-full bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            {errors.from_department && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.from_department}
              </p>
            )}
          </div>

          {/* To Department (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Department</label>
            <select
              name="to_department"
              value={formData.to_department}
              onChange={handleChange}
              className={`w-full py-3 px-4 border rounded-full focus:outline-none focus:ring-2 ${
                errors.to_department ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.to_department && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.to_department}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full py-3 px-4 border rounded-full focus:outline-none focus:ring-2 ${
                errors.priority ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.priority}
              </p>
            )}
          </div>

          {/* Raised By (Non-editable, hidden in UI but included in submission) */}
          <input
            type="hidden"
            name="raisedBy"
            value={formData.raisedBy}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-6 rounded-full 
              text-white font-medium 
              transition-all duration-200
              flex items-center justify-center
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#4B2D87] hover:bg-[#5E3A9F] hover:shadow-lg transform hover:-translate-y-0.5'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Raising Ticket...
              </>
            ) : (
              'Submit Ticket'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;