import { Bug, Edit2, X, Check, ChevronDown, ChevronUp, CalendarIcon, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyTickets, updateTicket, getAllDepartments, revokeTicket, filterTickets } from '../services/authService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editedData, setEditedData] = useState({
    title: '',
    description: '',
    to_department: ''
  });
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filterParams, setFilterParams] = useState({
    status: '',
    to_department: '',
    startDate: '',
    endDate: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false); // <-- Added state for filter

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'revoked', label: 'Revoked' }
  ];

  // Move fetchTickets to component scope so it can be called elsewhere
  const fetchTickets = async () => {
    try {
      const fetchedTickets = await getMyTickets();
      setTickets(fetchedTickets);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        console.log('Fetched departments:', data);
        
        const validDepartments = data.filter(dept => 
          dept && (dept._id || dept.id) && dept.name
        );
        
        if (validDepartments.length === 0) {
          console.warn('No valid departments found in response');
          toast.warning('No departments available');
        }

        setDepartments(validDepartments);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        toast.error('Failed to load departments');
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  const handleEditClick = (ticket) => {
    setEditingTicket(ticket);
    setEditedData({
      title: ticket.title,
      description: ticket.description || '',
      to_department: ticket.to_department?.name || '' // Changed to use name instead of id
    });
  };

  const handleSaveEdit = async (ticketId) => {
    try {
      if (!editedData.title || !editedData.to_department) {
        toast.error('Title and department are required');
        return;
      }

      const updatedTicket = await updateTicket(ticketId, editedData);
      
      // Find the department details from departments array using name
      const department = departments.find(dept => dept.name === editedData.to_department);
      
      // Update the tickets array with the correct department structure
      const updatedTickets = tickets.map(ticket => {
        if (ticket._id === ticketId) {
          return {
            ...updatedTicket,
            to_department: {
              id: department ? (department.id || department._id) : null, // Use id or _id
              name: editedData.to_department // Use the name directly from editedData
            }
          };
        }
        return ticket;
      });

      setTickets(updatedTickets);
      setEditingTicket(null);
      setEditedData({ title: '', description: '', to_department: '' });
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Failed to update ticket');
      console.error('Update error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTicket(null);
    setEditedData({ title: '', description: '', to_department: '' });
  };

  const toggleTicketExpand = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const handleRevokeTicket = async (ticketId) => {
    try {
      await revokeTicket(ticketId);
      
      // Update the tickets list to reflect the revoked status
      const updatedTickets = tickets.map(ticket => 
        ticket._id === ticketId 
          ? { ...ticket, status: 'revoked' }
          : ticket
      );
      
      setTickets(updatedTickets);
      toast.success('Ticket revoked successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to revoke ticket');
      console.error('Revoke error:', error);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const filteredResults = await filterTickets(filterParams);
      setTickets(filteredResults);
    } catch (error) {
      toast.error('Failed to filter tickets');
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'open': 'bg-blue-100 text-blue-800',
    'assigned': 'bg-purple-100 text-purple-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800',
    'revoked': 'bg-yellow-100 text-yellow-800',
  };

  const getDepartmentName = (deptId) => {
    const department = departments.find(dept => dept._id === deptId || dept.id === deptId);
    return department?.name || 'Unknown Department';
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4B2D87]">MyTickets</h1>
          <p className="text-gray-600 mt-1">View and manage your submitted tickets</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Tickets</h3>
            
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  isFilterOpen || Object.values(filterParams).some(value => value !== '')
                    ? 'bg-[#4B2D87] text-white border-[#4B2D87]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter size={16} />
                <span>Filter</span>
                {Object.values(filterParams).some(value => value !== '') && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-white" />
                )}
              </button>

              {/* Dropdown Filter Panel */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 w-[600px]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={filterParams.status}
                          onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2D87]"
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <select
                          value={filterParams.to_department}
                          onChange={(e) => setFilterParams(prev => ({ ...prev, to_department: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2D87]"
                        >
                          <option value="">All Departments</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={filterParams.startDate}
                          onChange={(e) => setFilterParams(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2D87]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={filterParams.endDate}
                          onChange={(e) => setFilterParams(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2D87]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <button
                        onClick={() => {
                          setFilterParams({
                            status: '',
                            to_department: '',
                            startDate: '',
                            endDate: ''
                          });
                          fetchTickets();
                          setIsFilterOpen(false);
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          handleFilter();
                          setIsFilterOpen(false);
                        }}
                        className="px-4 py-2 text-sm bg-[#4B2D87] text-white rounded-lg hover:bg-[#3D2276] transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No tickets found matching your filters</p>
            </div>
          ) : (
            tickets.map((ticket, index) => (
              <div 
                key={ticket._id} 
                className="bg-white rounded-lg border border-gray-200 hover:border-[#4B2D87] transition-colors overflow-hidden"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => !editingTicket && toggleTicketExpand(ticket._id)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{index + 1}.</p>
                      {!editingTicket && (
                        expandedTicket === ticket._id ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.to_department?.name || 
                         getDepartmentName(ticket.to_department?.id) ||
                         'Unknown Department'}
                      </p>
                      {editingTicket?._id === ticket._id ? (
                        <div className="space-y-3 mt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editedData.title}
                              onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))}
                              className="flex-1 text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                              placeholder="Issue title"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSaveEdit(ticket._id)}
                              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-gray-500">Issue Regarding {ticket.title}</p>
                          <button
                            onClick={() => handleEditClick(ticket)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Edit2 size={14} className="text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-count space-x-4">
                    {ticket.status === 'open' && !editingTicket && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevokeTicket(ticket._id);
                        }}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[ticket.status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status || 'Unknown'}
                    </span>
                    <p className="text-xs text-gray-500 min-w-[120px] text-right">
                      {format(new Date(ticket.createdAt), 'MMM dd, yyyy - h:mm a')}
                    </p>
                  </div>
                </div>

                {(expandedTicket === ticket._id && !editingTicket) && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {ticket.description || 'No description provided'}
                      </p>
                    </div>
                  </div>
                )}

                {editingTicket?._id === ticket._id && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editedData.description}
                          onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent"
                          rows="2"
                          placeholder="Describe the issue"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Assign To Department
                        </label>
                        <div className="relative">
                          <select
                            value={editedData.to_department}
                            onChange={(e) => setEditedData({ ...editedData, to_department: e.target.value })}
                            className="w-full text-xs px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#4B2D87] focus:border-transparent appearance-none"
                          >
                            <option value="">Select a department</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.name}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;