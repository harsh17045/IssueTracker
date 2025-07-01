import { useState, useEffect } from 'react';
import { UserCog, Search, Plus, Mail, X, MapPin } from 'lucide-react';
import { createDepartmentalAdmin, getAllDepartments, getAllDepartmentalAdmins, getAvailableNetworkEngineerFloors } from '../service/adminAuthService';
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
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [buildingAssignments, setBuildingAssignments] = useState([]);
  const [viewLocationsModal, setViewLocationsModal] = useState({ open: false, locations: [], adminName: '' });

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

  const handleDepartmentChange = async (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, department: value }));
    if (value.toLowerCase().includes('network engineer')) {
      try {
        const assignments = await getAvailableNetworkEngineerFloors();
        setAvailableAssignments(assignments);
        setSelectedBuilding('');
        setSelectedFloor('');
        setSelectedLabs([]);
        setBuildingAssignments([]);
      } catch {
        toast.error('Failed to fetch available buildings/floors');
        setAvailableAssignments([]);
      }
    } else {
      setAvailableAssignments([]);
      setSelectedBuilding('');
      setSelectedFloor('');
      setSelectedLabs([]);
      setBuildingAssignments([]);
    }
  };

  const handleBuildingChange = (e) => {
    setSelectedBuilding(e.target.value);
    setSelectedFloor('');
    setSelectedLabs([]);
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
    setSelectedLabs([]);
  };

  const handleLabSelection = (lab) => {
    setSelectedLabs(prev => {
      if (prev.includes(lab)) {
        return prev.filter(l => l !== lab);
      } else {
        return [...prev, lab];
      }
    });
  };

  const addBuildingAssignment = () => {
    if (!selectedBuilding || !selectedFloor) {
      toast.error('Please select both building and floor');
      return;
    }

    if (selectedLabs.length === 0) {
      toast.error('Please select at least one lab');
      return;
    }

    const buildingObj = availableAssignments.find(b => b.buildingId === selectedBuilding);
    if (!buildingObj) {
      toast.error('Invalid building selection');
      return;
    }

    // Check if this combination already exists
    const exists = buildingAssignments.some(
      assignment => assignment.buildingId === selectedBuilding && assignment.floor === selectedFloor
    );

    if (exists) {
      toast.error('This building-floor combination is already added');
      return;
    }

    const newAssignment = {
      buildingId: selectedBuilding,
      buildingName: buildingObj.buildingName,
      floor: selectedFloor,
      labs: [...selectedLabs]
    };

    setBuildingAssignments(prev => [...prev, newAssignment]);
    setSelectedBuilding('');
    setSelectedFloor('');
    setSelectedLabs([]);
  };

  const removeBuildingAssignment = (index) => {
    setBuildingAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let submitData = { ...formData };
      if (formData.department.toLowerCase().includes('network engineer')) {
        if (buildingAssignments.length === 0) {
          toast.error('Please add at least one building-floor assignment for Network Engineer');
          return;
        }
        submitData.buildingAssignments = buildingAssignments;
      }
      console.log(submitData);
      await createDepartmentalAdmin(submitData);
      toast.success('Departmental admin created successfully');
      setShowAddModal(false);
      setFormData({ name: '', email: '', department: '' });
      setAvailableAssignments([]);
      setSelectedBuilding('');
      setSelectedFloor('');
      setSelectedLabs([]);
      setBuildingAssignments([]);
      fetchData(); // Refresh the list after adding
    } catch (error) {
      toast.error(error.message || 'Failed to create departmental admin');
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setFormData({ name: '', email: '', department: '' });
    setAvailableAssignments([]);
    setSelectedBuilding('');
    setSelectedFloor('');
    setSelectedLabs([]);
    setBuildingAssignments([]);
  };

  // Get available labs for selected building and floor
  const getAvailableLabs = () => {
    if (!selectedBuilding || !selectedFloor) return [];
    const buildingObj = availableAssignments.find(b => b.buildingId === selectedBuilding);
    if (!buildingObj) return [];
    const floorObj = buildingObj.availableFloors.find(f => f.floor === parseInt(selectedFloor));
    return floorObj ? floorObj.availableLabs : [];
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
              <div className="bg-white rounded-2xl shadow-lg p-7 relative z-10 group-hover:shadow-2xl transition-all duration-200 flex flex-col justify-between items-stretch w-full h-[320px] min-h-[170px] max-h-[170px] min-w-[280px] max-w-[350px] mx-auto">
                <div className="flex items-start gap-4 flex-1">
                  {/* Status badge in top-right */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-2 py-1 text-xs rounded-full shadow font-semibold ${
                      admin.isFirstLogin 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {admin.isFirstLogin ? 'First Login Pending' : 'Active'}
                    </span>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full shadow-sm">
                    <UserCog className="text-purple-600" size={28} />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 truncate" title={admin.name}>{admin.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 truncate" title={admin.email}><Mail size={14} className="inline-block" /> {admin.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-medium shadow-sm truncate max-w-full" title={admin.department?.name || 'No Department'}>
                      {admin.department?.name || 'No Department'}
                    </span>
                    {/* View Locations Button for Network Engineers */}
                    {admin.department?.name?.toLowerCase().includes('network engineer') && admin.locations && admin.locations.length > 0 && (
                      <button
                        className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors w-fit"
                        onClick={() => setViewLocationsModal({ open: true, locations: admin.locations, adminName: admin.name })}
                      >
                        View Locations
                      </button>
                    )}
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

        {/* View Locations Modal */}
        {viewLocationsModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={() => setViewLocationsModal({ open: false, locations: [], adminName: '' })}
                title="Close"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{viewLocationsModal.adminName}'s Locations</h2>
              <table className="min-w-full text-xs border">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-3 py-2 border">Building</th>
                    <th className="px-3 py-2 border">Floor</th>
                    <th className="px-3 py-2 border">Labs</th>
                  </tr>
                </thead>
                <tbody>
                  {viewLocationsModal.locations.map((loc, idx) => {
                    const buildingName = typeof loc.building === 'string' ? loc.building : loc.building?.name || 'Unknown Building';
                    return (
                      <tr key={idx} className="even:bg-gray-50">
                        <td className="px-3 py-2 border font-medium">{buildingName}</td>
                        <td className="px-3 py-2 border">{loc.floor}</td>
                        <td className="px-3 py-2 border">{loc.labs && loc.labs.length > 0 ? loc.labs.join(', ') : <span className="text-gray-400">None</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
                    onChange={handleDepartmentChange}
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

                {/* Show building/floor assignment section only for Network Engineer */}
                {formData.department.toLowerCase().includes('network engineer') && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Buildings</h3>
                    
                    {/* Current Assignments */}
                    {buildingAssignments.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Assignments:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {buildingAssignments.map((assignment, index) => (
                            <div 
                              key={index} 
                              className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                              title={`Labs: ${assignment.labs.join(', ')}`}
                            >
                              <div className="flex-1">
                                <div className="text-sm font-medium text-blue-800">
                                  {assignment.buildingName} - F{assignment.floor}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {assignment.labs.length} lab{assignment.labs.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeBuildingAssignment(index)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                title="Remove assignment"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Assignment */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Assignment</h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Building</label>
                          <select
                            value={selectedBuilding}
                            onChange={handleBuildingChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                          >
                            <option value="">Select Building</option>
                            {availableAssignments.map((b) => (
                              <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Floor</label>
                          <select
                            value={selectedFloor}
                            onChange={handleFloorChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                            disabled={!selectedBuilding}
                          >
                            <option value="">Select Floor</option>
                            {availableAssignments.find(b => b.buildingId === selectedBuilding)?.availableFloors.map(floor => (
                              <option key={floor.floor} value={floor.floor}>{floor.floor}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Labs Selection */}
                      {selectedBuilding && selectedFloor && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 mb-2">Select Labs:</label>
                          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                            {getAvailableLabs().map((lab) => (
                              <label key={lab} className="flex items-center space-x-2 text-xs">
                                <input
                                  type="checkbox"
                                  checked={selectedLabs.includes(lab)}
                                  onChange={() => handleLabSelection(lab)}
                                  className="rounded border-gray-300 text-[#4B2D87] focus:ring-[#4B2D87]"
                                />
                                <span>{lab}</span>
                              </label>
                            ))}
                          </div>
                          {selectedLabs.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Selected: {selectedLabs.join(', ')}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={addBuildingAssignment}
                        className="w-full px-3 py-2 text-sm bg-[#4B2D87] text-white rounded-lg hover:bg-[#5E3A9F] transition-colors"
                        disabled={!selectedBuilding || !selectedFloor || selectedLabs.length === 0}
                      >
                        Add Assignment
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={resetModal}
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