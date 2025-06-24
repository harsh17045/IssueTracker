import { Bug, Edit2, X, Check, ChevronDown, ChevronUp, CalendarIcon, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyTickets, getAllDepartments, revokeTicket, filterTickets } from '../services/authService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filterParams, setFilterParams] = useState({
    status: '',
    to_department: '',
    startDate: '',
    endDate: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [searchTerm, setSearchTerm] = useState('');
  const ticketsPerPage = 5; // Maximum 5 tickets per page
  const navigate = useNavigate();

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'revoked', label: 'Revoked' }
  ];

  const fetchTickets = async () => {
    try {
      const fetchedTickets = await getMyTickets();
      setTickets(fetchedTickets);
      setCurrentPage(1); // Reset to first page on new fetch
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
  };

  const handleRevokeTicket = async (ticketId) => {
    try {
      await revokeTicket(ticketId);
      
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
      setCurrentPage(1); // Reset to first page after filtering
    } catch (error) {
      toast.error('Failed to filter tickets');
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Filter tickets by search term
  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B2D87] bg-gray-50"
                placeholder="Search tickets by title or description..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="relative ml-4">
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
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No tickets found matching your filters</p>
            </div>
          ) : (
            filteredTickets.slice(startIndex, endIndex).map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition p-5 mb-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer"
                onClick={() => navigate(`/my-tickets/${ticket._id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-[#4B2D87]">{ticket.title}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2
                      ${ticket.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {['high', 'low'].includes(ticket.priority) && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold
                        ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'}`}>
                        {ticket.priority}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {ticket.to_department?.name || 'Unknown Department'} &bull; {format(new Date(ticket.createdAt), 'MMM dd, yyyy - h:mm a')}
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-2">{ticket.description}</div>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/my-tickets/${ticket._id}`);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="View"
                  >
                    <ChevronRight size={18} className="text-[#4B2D87]" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleEditClick(ticket);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                  {ticket.status === 'pending' && !editingTicket && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRevokeTicket(ticket._id);
                      }}
                      className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {tickets.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, tickets.length)} of {tickets.length} tickets
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === index + 1
                        ? 'bg-[#4B2D87] text-white'
                        : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;