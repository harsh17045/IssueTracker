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
  const [attachment, setAttachment] = useState(null); // <-- NEW
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

  // NEW: Handle file input
  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
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
      
      console.log('Raising ticket with data:', ticketData,attachment);
      // Pass the file as the second argument
      const response = await raiseTicket(ticketData, attachment);
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

          {/* File input for attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment (optional)
            </label>
            <div className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed rounded-lg border-gray-300 hover:border-[#4B2D87] transition-colors">
              <div className="space-y-1 text-center">
                {attachment ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center px-3 py-2 rounded-lg bg-purple-50 text-[#4B2D87]">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h8m-4-4v8m-12 4h.02" 
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#4B2D87] hover:text-[#5E3A9F] focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="attachment" 
                          type="file" 
                          onChange={handleFileChange}
                          className="sr-only" 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
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