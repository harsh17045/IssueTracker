// import React from 'react';
// import { AlertTriangle, CheckCircle, Clock, Bug, Plus, FileText, Users, BarChart3 } from 'lucide-react';

// const StatsCard = ({ title, value, change, icon, color }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm border">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
//           <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
//             {change > 0 ? '+' : ''}{change}% from last week
//           </p>
//         </div>
//         <div className={`p-3 rounded-full ${color}`}>
//           {icon && React.createElement(icon, { size: 24, className: "text-white" })}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Issue Card Component
// const IssueCard = ({ issue }) => {
//   const priorityColors = {
//     'High': 'bg-red-100 text-red-800',
//     'Medium': 'bg-yellow-100 text-yellow-800',
//     'Low': 'bg-green-100 text-green-800'
//   };

//   const statusColors = {
//     'Open': 'bg-blue-100 text-blue-800',
//     'In Progress': 'bg-purple-100 text-purple-800',
//     'Resolved': 'bg-green-100 text-green-800',  
//     'Closed': 'bg-gray-100 text-gray-800'
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-mono text-gray-500">#{issue.id}</span>
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
//             {issue.priority}
//           </span>
//         </div>
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
//           {issue.status}
//         </span>
//       </div>
      
//       <h4 className="font-medium text-gray-900 mb-2">{issue.title}</h4>
//       <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
      
//       <div className="flex items-center justify-between text-xs text-gray-500">
//         <div className="flex items-center space-x-2">
//           <span>{issue.department}</span>
//           <span>•</span>
//           <span>{issue.assignee}</span>
//         </div>
//         <span>{issue.created}</span>
//       </div>
//     </div>
//   );
// };

// const HomePage = () => {
//   const stats = [
//     { title: 'Open Issues', value: '43', change: 8, icon: AlertTriangle, color: 'bg-red-500' },
//     { title: 'In Progress', value: '27', change: -5, icon: Clock, color: 'bg-blue-500' },
//     { title: 'Resolved Today', value: '12', change: 15, icon: CheckCircle, color: 'bg-green-500' },
//     { title: 'Total Issues', value: '156', change: 12, icon: Bug, color: 'bg-purple-500' },
//   ];

//   const recentIssues = [
//     {
//       id: '1234',
//       title: 'Login page not loading correctly on mobile devices',
//       description: 'Users are reporting that the login form is not displaying properly on mobile screens.',
//       priority: 'High',
//       status: 'Open',
//       department: 'IT',
//       assignee: 'Sarah Johnson',
//       created: '2 hours ago'
//     },
//     {
//       id: '1235',
//       title: 'Employee payroll calculation error',
//       description: 'There seems to be a miscalculation in the overtime hours for several employees.',
//       priority: 'High',
//       status: 'In Progress',
//       department: 'Finance',
//       assignee: 'Mike Davis',
//       created: '4 hours ago'
//     },
//     {
//       id: '1236',
//       title: 'Office air conditioning not working',
//       description: 'The AC unit on the 3rd floor has stopped working.',
//       priority: 'Medium',
//       status: 'Open',
//       department: 'Admin',
//       assignee: 'Tom Wilson',
//       created: '6 hours ago'
//     }
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Issue Tracker Dashboard</h1>
//           <p className="text-gray-600 mt-1">Monitor and manage all department issues</p>
//         </div>
//         <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
//           <Plus size={18} />
//           <span>Create Issue</span>
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <StatsCard key={index} {...stat} />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Issues */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-sm border">
//             <div className="p-6 border-b">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
//                 <button className="text-red-600 hover:text-red-700 text-sm font-medium">
//                   View All
//                 </button>
//               </div>
//             </div>
//             <div className="p-6 space-y-4">
//               {recentIssues.map((issue) => (
//                 <IssueCard key={issue.id} issue={issue} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions & Department Stats */}
//         <div className="space-y-6">
//           {/* Quick Actions */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="space-y-3">
//               <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                 <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
//                   <Bug size={16} className="text-red-600" />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">Report New Issue</span>
//               </button>
              
//               <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <FileText size={16} className="text-blue-600" />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">Generate Report</span>
//               </button>
              
//               <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                   <Users size={16} className="text-green-600" />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">Assign Issues</span>
//               </button>
//             </div>
//           </div>

//           {/* Department Overview */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Department</h3>
//             <div className="space-y-3">
//               {[
//                 { dept: 'IT', count: 23, color: 'bg-blue-500' },
//                 { dept: 'HR', count: 18, color: 'bg-green-500' },
//                 { dept: 'Finance', count: 15, color: 'bg-purple-500' },
//                 { dept: 'Admin', count: 12, color: 'bg-orange-500' },
//                 { dept: 'Marketing', count: 8, color: 'bg-pink-500' }
//               ].map((item) => (
//                 <div key={item.dept} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
//                     <span className="text-sm font-medium text-gray-700">{item.dept}</span>
//                   </div>
//                   <span className="text-sm font-bold text-gray-900">{item.count}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Priority Overview Chart */}
//       <div className="bg-white p-6 rounded-lg shadow-sm border">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Priority Distribution</h3>
//         <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//           <div className="text-center">
//             <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
//             <p className="text-gray-500">Priority distribution chart will be displayed here</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Bug, Plus, FileText, Users, BarChart3 } from 'lucide-react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon && React.createElement(icon, { size: 24, className: "text-white" })}
      </div>
    </div>
  );
};

// Issue Card Component (Modified to resemble "Jobie" Applications table)
const IssueCard = ({ issue }) => {
  const statusColors = {
    'Open': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    'Resolved': 'bg-green-100 text-green-800',  
    'Closed': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-2xl border hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm font-medium text-gray-900">#{issue.id}</p>
            <p className="text-xs text-gray-500">{issue.created}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{issue.department}</p>
            <p className="text-xs text-gray-500">{issue.title}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
          {issue.status}
        </span>
      </div>
    </div>
  );
};

const HomePage = () => {
  const stats = [
    { title: 'Open Issues', value: '43', change: 8, icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'In Progress', value: '27', change: -5, icon: Clock, color: 'bg-blue-500' },
    { title: 'Resolved', value: '12', change: 15, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Total Issues', value: '156', change: 12, icon: Bug, color: 'bg-purple-500' },
  ];

  const recentIssues = [
    {
      id: '1234',
      title: 'Login page issue',
      description: 'Users are reporting issues.',
      priority: 'High',
      status: 'Open',
      department: 'IT',
      assignee: 'Sarah Johnson',
      created: '2 hours ago'
    },
    {
      id: '1235',
      title: 'Payroll error',
      description: 'Overtime miscalculation.',
      priority: 'High',
      status: 'In Progress',
      department: 'Finance',
      assignee: 'Mike Davis',
      created: '4 hours ago'
    },
    {
      id: '1236',
      title: 'AC not working',
      description: '3rd floor AC unit failure.',
      priority: 'Medium',
      status: 'Open',
      department: 'Admin',
      assignee: 'Tom Wilson',
      created: '6 hours ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Tracker Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all department issues</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Issues */}
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-[#4B2D87] text-white rounded-full hover:bg-[#5E3A9F] transition-colors">
                  All
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                  Pending
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                  Resolved
                  </button>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
