import { Bug } from 'lucide-react';

const MyIssues = () => {
  // Mock data - replace with API call
  const issues = [
    {
      id: '1234',
      title: 'Login page not loading correctly on mobile devices',
      priority: 'High',
      status: 'Open',
      department: 'IT',
      created: '2 hours ago',
    },
    {
      id: '1235',
      title: 'Employee payroll calculation error',
      priority: 'High',
      status: 'In Progress',
      department: 'Finance',
      created: '4 hours ago',
    },
    {
      id: '1236',
      title: 'Office air conditioning not working',
      priority: 'Medium',
      status: 'Open',
      department: 'Admin',
      created: '6 hours ago',
    },
  ];

  const statusColors = {
    'Open': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4B2D87]">My Issues</h1>
          <p className="text-gray-600 mt-1">View and manage your submitted issues</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Issues</h3>
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
          {issues.length === 0 ? (
            <div className="text-center py-10">
              <Bug size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No issues found</p>
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-2xl border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <input type="checkbox" className="h-4 w-4 text-[#4B2D87] focus:ring-[#4B2D87] border-gray-300 rounded" />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyIssues;