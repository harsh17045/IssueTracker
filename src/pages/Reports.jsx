import { useState } from 'react';
import { DownloadCloud, BarChart2, FileText, Loader } from 'lucide-react';
import { generateTicketReport } from '../service/adminAuthService';
import { toast } from 'react-toastify';
import AdminLayout from '../layout/AdminLayout';

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateTicketReport();
      
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_report_${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600">Generate and download reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ticket Report Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
              <BarChart2 className="text-gray-400" size={20} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ticket Summary Report
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Comprehensive report of all tickets across departments
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Report includes:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                  Department-wise breakdown
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                  Ticket status distribution
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                  Resolution metrics
                </li>
              </ul>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Generating Report...
                </>
              ) : (
                <>
                  <DownloadCloud size={16} />
                  Generate & Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;