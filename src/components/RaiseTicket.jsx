import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { raiseTicket, getAllDepartments } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RaiseTicket = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    to_department: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch only departments that can resolve tickets
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const data = await getAllDepartments();
        // Only departments with canResolve === true
        const resolvingDepartments = data.filter(
          dept => dept && (dept._id || dept.id) && dept.name && dept.canResolve === true
        );
        setDepartments(resolvingDepartments);
        if (resolvingDepartments.length === 0) {
          toast.warning('No departments available for ticket resolution');
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        toast.error('Failed to load departments');
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.to_department) newErrors.to_department = 'Please select a department';
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
      const ticketData = {
        title: formData.title,
        description: formData.description,
        from_department: employee?.department || 'No Department',
        raisedBy: employee?._id || employee?.email || '',
        to_department: formData.to_department // This is the department name
      };

      console.log('Submitting ticket data:', ticketData);
      const response = await raiseTicket(ticketData);
      console.log('Ticket response:', response);
      if (response.message === 'Ticket raised successfully') {
        toast.success('Ticket raised successfully!');
        navigate('/my-tickets');
      } else {
        throw new Error(response.message || 'Failed to raise ticket');
      }
      
    } catch (error) {
      console.error('Error raising ticket:', error);
      toast.error(error.message || 'Failed to raise ticket');
      setErrors({ form: error.message || 'Failed to raise ticket' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#4B2D87]">Raise a Ticket</h1>
        <p className="text-gray-600 mt-1">Submit a new ticket for assistance</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full py-3 px-4 border rounded-full focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
              placeholder="Enter ticket title"
            />
            {errors.title && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
              placeholder="Describe your issue"
            />
            {errors.description && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Department</label>
            <select
              name="to_department"
              value={formData.to_department}
              onChange={handleChange}
              className={`w-full py-3 px-4 border rounded-full focus:outline-none focus:ring-2 ${
                errors.to_department ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#4B2D87]'
              }`}
              disabled={loading}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept._id || dept.id} value={dept.name}>
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#4B2D87] text-white rounded-full hover:bg-[#5E3A9F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;