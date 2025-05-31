import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Bug, XCircle, Lock } from 'lucide-react';
import { getMyTickets } from '../services/authService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon && React.createElement(icon, { size: 24, className: "text-white" })}
      </div>
    </div>
  );
};

// Update the TicketCard component to be more compact
const TicketCard = ({ ticket, index }) => {
  const navigate = useNavigate();
  const statusColors = {
    'open': 'bg-blue-100 text-blue-800',
    'assigned': 'bg-purple-100 text-purple-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800',
    'revoked': 'bg-yellow-100 text-yellow-800',
  };

  const handleTicketClick = () => {
    navigate('/my-tickets');
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-[#4B2D87] transition-colors overflow-hidden cursor-pointer flex-1 min-w-0"
      onClick={handleTicketClick}
    >
      <div className="p-4">
        <div className="flex flex-col h-full">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {index + 1}. {ticket.title}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-xs font-medium text-gray-600 truncate">
              {ticket.to_department?.name || 'Unknown Department'}
            </p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[ticket.status] || 'bg-gray-100 text-gray-800'
            }`}>
              {ticket.status || 'Unknown'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [recentTickets, setRecentTickets] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Open Tickets', value: '0', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Assigned', value: '0', icon: Clock, color: 'bg-blue-500' },
    { title: 'Resolved', value: '0', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Closed', value: '0', icon: Lock, color: 'bg-gray-500' },
    { title: 'Revoked', value: '0', icon: XCircle, color: 'bg-yellow-500' },
    { title: 'Total Tickets', value: '0', icon: Bug, color: 'bg-purple-500' },
  ]);
  const [loading, setLoading] = useState(true);
  // Add new state for filtering
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getMyTickets();
        console.log('Fetched Tickets for Dashboard:', fetchedTickets);
        if (Array.isArray(fetchedTickets)) {
          // Calculate dynamic stats
          const openTickets = fetchedTickets.filter(ticket => ticket.status === 'open').length;
          const inProgressTickets = fetchedTickets.filter(ticket => ticket.status === 'assigned').length;
          const resolvedTickets = fetchedTickets.filter(ticket => ticket.status === 'resolved').length;
          const closedTickets = fetchedTickets.filter(ticket => ticket.status === 'closed').length;
          const revokedTickets = fetchedTickets.filter(ticket => ticket.status === 'revoked').length;
          const totalTickets = fetchedTickets.length;

          // Update stats with dynamic values
          setStats([
            { title: 'Open Tickets', value: openTickets.toString(), icon: AlertTriangle, color: 'bg-red-500' },
            { title: 'Assigned', value: inProgressTickets.toString(), icon: Clock, color: 'bg-blue-500' },
            { title: 'Resolved', value: resolvedTickets.toString(), icon: CheckCircle, color: 'bg-green-500' },
            { title: 'Closed', value: closedTickets.toString(), icon: Lock, color: 'bg-gray-500' },
            { title: 'Revoked', value: revokedTickets.toString(), icon: XCircle, color: 'bg-yellow-500' },
            { title: 'Total Tickets', value: totalTickets.toString(), icon: Bug, color: 'bg-purple-500' },
          ]);

          // Sort by createdAt (newest first) and take top 3 for recent tickets
          const sortedTickets = [...fetchedTickets].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentTickets(sortedTickets.slice(0, 3));
        } else {
          setRecentTickets([]);
          setStats([
            { title: 'Open Tickets', value: '0', icon: AlertTriangle, color: 'bg-red-500' },
            { title: 'Assigned', value: '0', icon: Clock, color: 'bg-blue-500' },
            { title: 'Resolved', value: '0', icon: CheckCircle, color: 'bg-green-500' },
            { title: 'Closed', value: '0', icon: Lock, color: 'bg-gray-500' },
            { title: 'Revoked', value: '0', icon: XCircle, color: 'bg-yellow-500' },
            { title: 'Total Tickets', value: '0', icon: Bug, color: 'bg-purple-500' },
          ]);
          toast.error('Invalid ticket data received');
        }
      } catch (error) {
        toast.error('Failed to fetch tickets');
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Add filter function
  useEffect(() => {
    if (!recentTickets) return;

    switch (activeFilter) {
      case 'open':
        setFilteredTickets(recentTickets.filter(ticket => ticket.status === 'open'));
        break;
      case 'assigned':
        setFilteredTickets(recentTickets.filter(ticket => ticket.status === 'assigned'));
        break;
      case 'resolved':
        setFilteredTickets(recentTickets.filter(ticket => ticket.status === 'resolved'));
        break;
      case 'closed':
        setFilteredTickets(recentTickets.filter(ticket => ticket.status === 'closed'));
        break;
      case 'revoked':
        setFilteredTickets(recentTickets.filter(ticket => ticket.status === 'revoked'));
        break;
      default:
        setFilteredTickets(recentTickets);
    }
  }, [activeFilter, recentTickets]);

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IssueTracker Dashboard</h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Tickets */}
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeFilter === 'all' 
                      ? 'bg-[#4B2D87] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('open')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeFilter === 'open' 
                      ? 'bg-[#4B2D87] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Open
                </button>
                <button 
                  onClick={() => setActiveFilter('assigned')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeFilter === 'assigned' 
                      ? 'bg-[#4B2D87] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Assigned
                </button>
                <button 
                  onClick={() => setActiveFilter('resolved')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeFilter === 'resolved' 
                      ? 'bg-[#4B2D87] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Resolved
                </button>
                <button 
                  onClick={() => setActiveFilter('closed')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeFilter === 'closed' 
                      ? 'bg-[#4B2D87] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Closed
                </button>
                <button 
                  onClick={() => setActiveFilter('revoked')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeFilter === 'revoked' 
                      ? 'bg-[#4B2D87] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Revoked
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Loading recent tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-10">
                <Bug size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  No {activeFilter !== 'all' ? activeFilter : 'recent'} tickets found
                </p>
              </div>
            ) : (
              <div className="flex gap-4">
                {filteredTickets.map((ticket, index) => (
                  <TicketCard key={ticket._id} ticket={ticket} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;