import { Bug } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyTickets } from '../services/authService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchTickets();
  }, []);

  const statusColors = {
    'open': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-purple-100 text-purple-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800',
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
          <h1 className="text-2xl font-bold text-[#4B2D87]">My Tickets</h1>
          <p className="text-gray-600 mt-1">View and manage your submitted tickets</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Tickets</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-[#4B2D87] text-white rounded-full hover:bg-[#5E3A9F] transition-colors">
                All
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                Open
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                In Progress
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-10">
              <Bug size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No tickets found</p>
            </div>
          ) : (
            tickets.map((ticket, index) => (
              <div key={ticket._id} className="bg-white rounded-2xl border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{index + 1}.</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.to_department?.name || 'Unknown Department'}
                      </p>
                      <p className="text-xs text-gray-500">Issue Regarding {ticket.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;