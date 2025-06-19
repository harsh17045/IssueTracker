import { useState, useEffect } from 'react';
import { Building2, Ticket, Users, Clock, AlertCircle, CheckCircle2, XCircle, TrendingUp, Activity } from 'lucide-react';
import { useDeptAuth } from '../../context/DeptAuthContext';
import { getDepartmentTickets } from '../../service/deptAuthService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, ComposedChart } from 'recharts';

export default function DepartmentDashboard() {
  const { deptAdmin } = useDeptAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  
  console.log('Dashboard component rendered');
  console.log('deptAdmin from context:', deptAdmin);
  
  // Calculate stats from tickets data
  const stats = {
    totalTickets: tickets.length,
    pendingTickets: tickets.filter(ticket => ticket.status === 'pending').length,
    inProgressTickets: tickets.filter(ticket => ticket.status === 'in_progress').length,
    resolvedTickets: tickets.filter(ticket => ticket.status === 'resolved').length,
    revokedTickets: tickets.filter(ticket => ticket.status === 'revoked').length
  };

  // Get recent tickets (last 5)
  const recentTickets = tickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Enhanced data for modern pie chart
  const pieChartData = [
    { 
      name: 'Pending', 
      value: stats.pendingTickets, 
      color: '#FF6B6B',
      fill: 'url(#pendingGradient)',
      stroke: '#FF5252'
    },
    { 
      name: 'In Progress', 
      value: stats.inProgressTickets, 
      color: '#4ECDC4',
      fill: 'url(#inProgressGradient)',
      stroke: '#26A69A'
    },
    { 
      name: 'Resolved', 
      value: stats.resolvedTickets, 
      color: '#45B7D1',
      fill: 'url(#resolvedGradient)',
      stroke: '#1976D2'
    },
    { 
      name: 'Revoked', 
      value: stats.revokedTickets, 
      color: '#96CEB4',
      fill: 'url(#revokedGradient)',
      stroke: '#66BB6A'
    }
  ];

  // Enhanced data for modern bar chart
  const statusData = [
    { 
      status: 'Pending', 
      count: stats.pendingTickets, 
      color: '#FF6B6B',
      fill: 'url(#pendingBarGradient)',
      stroke: '#FF5252'
    },
    { 
      status: 'In Progress', 
      count: stats.inProgressTickets, 
      color: '#4ECDC4',
      fill: 'url(#inProgressBarGradient)',
      stroke: '#26A69A'
    },
    { 
      status: 'Resolved', 
      count: stats.resolvedTickets, 
      color: '#45B7D1',
      fill: 'url(#resolvedBarGradient)',
      stroke: '#1976D2'
    },
    { 
      status: 'Revoked', 
      count: stats.revokedTickets, 
      color: '#96CEB4',
      fill: 'url(#revokedBarGradient)',
      stroke: '#66BB6A'
    }
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getDepartmentTickets();
      
      if (result.success) {
        setTickets(result.tickets);
      } else {
        setError(result.message);
        // Fallback to static data if API fails
        setTickets([
          {
            _id: 1,
            title: "Printer not working in Lab 101",
            status: "pending",
            createdAt: "2024-03-20T10:00:00Z"
          },
          {
            _id: 2,
            title: "Network connectivity issue in Building A",
            status: "in_progress",
            createdAt: "2024-03-19T15:30:00Z"
          },
          {
            _id: 3,
            title: "AC not working in Room 203",
            status: "resolved",
            createdAt: "2024-03-18T09:15:00Z"
          },
          {
            _id: 4,
            title: "Software installation request",
            status: "revoked",
            createdAt: "2024-03-17T14:20:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError(error.message);
      // Fallback to static data
      setTickets([
        {
          _id: 1,
          title: "Printer not working in Lab 101",
          status: "pending",
          createdAt: "2024-03-20T10:00:00Z"
        },
        {
          _id: 2,
          title: "Network connectivity issue in Building A",
          status: "in_progress",
          createdAt: "2024-03-19T15:30:00Z"
        },
        {
          _id: 3,
          title: "AC not working in Room 203",
          status: "resolved",
          createdAt: "2024-03-18T09:15:00Z"
        },
        {
          _id: 4,
          title: "Software installation request",
          status: "revoked",
          createdAt: "2024-03-17T14:20:00Z"
        }
      ]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  if (loading) {
    console.log('Showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B2D87]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Tickets</p>
              <h3 className="text-3xl font-bold text-blue-800 mt-1">{stats.totalTickets}</h3>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Ticket className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border border-red-200 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Pending Tickets</p>
              <h3 className="text-3xl font-bold text-red-800 mt-1">{stats.pendingTickets}</h3>
            </div>
            <div className="p-3 bg-red-500 rounded-xl shadow-lg">
              <Clock className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-600 font-medium">In Progress</p>
              <h3 className="text-3xl font-bold text-teal-800 mt-1">{stats.inProgressTickets}</h3>
            </div>
            <div className="p-3 bg-teal-500 rounded-xl shadow-lg">
              <Activity className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Resolved Tickets</p>
              <h3 className="text-3xl font-bold text-blue-800 mt-1">{stats.resolvedTickets}</h3>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <CheckCircle2 className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Revoked Tickets</p>
              <h3 className="text-3xl font-bold text-green-800 mt-1">{stats.revokedTickets}</h3>
            </div>
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <XCircle className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets - Now at the top */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg mr-3">
              <Ticket className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Recent Tickets</h2>
          </div>
          <button 
            onClick={fetchTickets}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Created At</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Raised By</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">{ticket.title}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === 'pending' 
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : ticket.status === 'in_progress'
                          ? 'bg-teal-100 text-teal-800 border border-teal-200'
                          : ticket.status === 'resolved'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {ticket.raised_by?.name || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Ticket className="text-gray-300 mb-2" size={48} />
                      <p className="text-lg font-medium">No tickets found</p>
                      <p className="text-sm">Tickets will appear here once they are created</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Charts Section - Now at the bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Modern Pie Chart with Gradients */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
              <Activity className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Ticket Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <defs>
                <linearGradient id="pendingGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF6B6B" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FF5252" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="inProgressGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4ECDC4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#26A69A" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#45B7D1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1976D2" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="revokedGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#96CEB4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#66BB6A" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={3}
                stroke="#fff"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.stroke} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Modern Bar Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
              <Bar className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Status Comparison</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="pendingBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#FF5252" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="inProgressBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ECDC4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#26A69A" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="resolvedBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#45B7D1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1976D2" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="revokedBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#96CEB4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#66BB6A" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={60}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.stroke} strokeWidth={2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
