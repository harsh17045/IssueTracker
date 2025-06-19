import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Activity, CheckCircle2, XCircle, Ticket, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDepartmentTickets } from '../../service/deptAuthService';
import { useDeptAuth } from '../../context/DeptAuthContext';
import { toast } from 'react-toastify';

const TicketAssigned = () => {
  const navigate = useNavigate();
  const { deptAdmin } = useDeptAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await getDepartmentTickets();
      
      if (result.success) {
        // Filter only in_progress tickets
        const inProgressTickets = result.tickets.filter(ticket => ticket.status === 'in_progress');
        setTickets(inProgressTickets);
      } else {
        toast.error(result.message || 'Failed to fetch tickets');
        // Fallback to static data
        setTickets([
          {
            _id: 1,
            title: "Network connectivity issue in Building A",
            description: "WiFi connection is very slow in Building A",
            status: "in_progress",
            createdAt: "2024-03-19T15:30:00Z",
            raised_by: { name: "Jane Smith", email: "jane@example.com" }
          },
          {
            _id: 2,
            title: "Software installation request",
            description: "Need Adobe Creative Suite installed on lab computers",
            status: "in_progress",
            createdAt: "2024-03-18T14:20:00Z",
            raised_by: { name: "Mike Johnson", email: "mike@example.com" }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'in_progress':
        return { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' };
      case 'resolved':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'revoked':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Calendar size={16} />;
      case 'in_progress':
        return <Activity size={16} />;
      case 'resolved':
        return <CheckCircle2 size={16} />;
      case 'revoked':
        return <XCircle size={16} />;
      default:
        return <Ticket size={16} />;
    }
  };

  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortDirection === 'desc' 
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortField === 'title') {
        return sortDirection === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
      if (sortField === 'status') {
        return sortDirection === 'desc'
          ? b.status.localeCompare(a.status)
          : a.status.localeCompare(b.status);
      }
      return 0;
    });
  };

  const filteredTickets = sortTickets(tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  }));

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handleTicketClick = (ticketId) => {
    navigate(`/dept/tickets/${ticketId}`);
  };

  const handleSort = (field) => {
    setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleRefresh = () => {
    fetchTickets();
    toast.success('Tickets refreshed successfully');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assigned Tickets</h1>
          <p className="text-gray-600">
            {deptAdmin?.department || 'Department'} - Currently working on {tickets.length} tickets
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Refresh
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-teal-600 font-medium">Tickets In Progress</p>
            <h3 className="text-3xl font-bold text-teal-800 mt-1">{tickets.length}</h3>
            <p className="text-sm text-teal-600 mt-1">Currently being worked on</p>
          </div>
          <div className="p-3 bg-teal-500 rounded-xl shadow-lg">
            <Activity className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assigned tickets..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Activity className="text-teal-500" size={20} />
            <span className="text-sm font-medium text-teal-600">In Progress Only</span>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    {sortField === 'title' && (
                      <span className="text-teal-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Raised By</th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' && (
                      <span className="text-teal-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Assigned
                    {sortField === 'createdAt' && (
                      <span className="text-teal-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                      <span className="ml-2 text-gray-500">Loading assigned tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : currentTickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Activity className="text-gray-300 mb-2" size={48} />
                      <p className="text-lg font-medium text-gray-500">No tickets assigned</p>
                      <p className="text-sm text-gray-400">
                        {searchQuery ? 'Try adjusting your search' : 'Tickets will appear here when they are assigned to your department'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentTickets.map((ticket) => {
                  const statusColors = getStatusColor(ticket.status);
                  return (
                    <tr 
                      key={ticket._id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleTicketClick(ticket._id)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{ticket.title}</h3>
                          {ticket.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {ticket.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {ticket.raised_by?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ticket.raised_by?.email || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                          {getStatusIcon(ticket.status)}
                          In Progress
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketClick(ticket._id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstTicket + 1} to {Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length} assigned tickets
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketAssigned; 