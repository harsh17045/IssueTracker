import { useState, useEffect } from 'react';
import { UserCog, Search, Plus, Mail } from 'lucide-react';
import { createDepartmentalAdmin, getAllDepartments, getAllDepartmentalAdmins } from '../service/adminAuthService';
import { toast } from 'react-toastify';

const DepartmentalAdmins = () => {
  const [departmentalAdmins, setDepartmentalAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminsData, departmentsData] = await Promise.all([
        getAllDepartmentalAdmins(),
        getAllDepartments()
      ]);
      console.log('Fetched Departmental Admins:', adminsData);
      setDepartmentalAdmins(adminsData || []);
      // Filter departments to only include those with canResolve set to true
      const filteredDepartments = (departmentsData.depts || []).filter(dept => dept.canResolve);
      setDepartments(filteredDepartments);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDepartmentalAdmin(formData);
      toast.success('Departmental admin created successfully');
      setShowAddModal(false);
      setFormData({ name: '', email: '', department: '' });
      fetchData(); // Refresh the list after adding
    } catch (error) {
      toast.error(error.message || 'Failed to create departmental admin');
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B2D87]"></div>
        </div>
    );
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Departmental Admins</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-[#4B2D87] text-white rounded-lg hover:bg-[#5E3A9F] transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Admin
          </button>
        </div>

        {/* Display Departmental Admins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {departmentalAdmins.map((admin) => (
            <div key={admin._id} className="relative group">
              {/* Decorative Blurred Blob */}
              <div className="absolute -top-6 -left-6 w-40 h-32 bg-gradient-to-tr from-purple-200 via-blue-200 to-transparent rounded-full blur-2xl opacity-50 z-0 pointer-events-none group-hover:opacity-70 transition-all duration-300" />
              <div className="bg-white rounded-2xl shadow-lg p-7 relative z-10 group-hover:shadow-2xl transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full shadow-sm">
                    <UserCog className="text-purple-600" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Mail size={14} className="inline-block" /> {admin.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-medium shadow-sm">
                      {admin.department?.name || 'No Department'}
                    </span>
                    <span className={`inline-block mt-2 ml-2 px-2 py-1 text-xs rounded-full ${
                      admin.isFirstLogin 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {admin.isFirstLogin ? 'First Login Pending' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {departmentalAdmins.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserCog size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Departmental Admins</h3>
            <p className="text-gray-500">
              Start by adding your first departmental admin
            </p>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add Departmental Admin</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4B2D87] text-white rounded-lg hover:bg-[#5E3A9F]"
                  >
                    Add Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>  
  );
};

export default DepartmentalAdmins;