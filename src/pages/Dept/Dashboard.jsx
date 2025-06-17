import { useState, useEffect } from 'react';
import { Building2, Ticket, Users, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useDeptAuth } from '../../context/DeptAuthContext';

export default function DepartmentDashboard() {
  const { deptAdmin } = useDeptAuth();
  const [loading, setLoading] = useState(true);
  
  // Static data for stats
  const stats = {
    totalTickets: 25,
    pendingTickets: 10,
    resolvedTickets: 12,
    rejectedTickets: 3
  };

  // Static data for recent tickets
  const recentTickets = [
    {
      _id: 1,
      title: "Printer not working in Lab 101",
      status: "pending",
      createdAt: "2024-03-20T10:00:00Z"
    },
    {
      _id: 2,
      title: "Network connectivity issue in Building A",
      status: "resolved",
      createdAt: "2024-03-19T15:30:00Z"
    },
    {
      _id: 3,
      title: "AC not working in Room 203",
      status: "rejected",
      createdAt: "2024-03-18T09:15:00Z"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B2D87]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {deptAdmin?.name || 'Department Admin'}
        </h1>
        <p className="text-gray-600">
          {deptAdmin?.department || 'Department'} Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTickets}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ticket className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingTickets}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.resolvedTickets}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.rejectedTickets}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr key={ticket._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{ticket.title}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : ticket.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
