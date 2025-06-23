import { useState } from 'react';
import { DownloadCloud, BarChart2, FileText, Loader, PieChart } from 'lucide-react';
import { generateTicketReport, exportTicketReportExcel } from '../service/adminAuthService';
import { toast } from 'react-toastify';

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex justify-center py-4 relative overflow-x-hidden">
      {/* Decorative Blurred Blob */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-gradient-to-tr from-purple-200 via-blue-200 to-transparent rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />
      <div className="w-full max-w-2xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-2">
          <div className="w-14 h-14 flex items-center justify-center bg-purple-100 rounded-xl shadow">
            <FileText className="text-purple-600" size={32} />
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reports</h1>
          </div>
          <span className="text-gray-400 text-xs">Last generated: {new Date().toLocaleDateString()}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100 hover:shadow-2xl transition-all duration-200 relative overflow-hidden">
          {/* Ribbon/Bookmark Tag */}
          <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <BarChart2 className="text-blue-400" size={22} />
            Ticket Summary Report
          </h3>
          <p className="text-gray-600 text-sm mb-3">Comprehensive report of all tickets across departments</p>
          <div className="bg-purple-50 rounded-xl p-3 mb-4">
            <span className="text-gray-600 font-medium text-sm">Report includes:</span>
            <ul className="text-sm text-gray-700 space-y-1 mt-2">
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2" />Department-wise breakdown
              </li>
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2" />Ticket status distribution
              </li>
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2" />Resolution metrics
              </li>
            </ul>
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="flex flex-col gap-2">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className={`w-full flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-base font-medium shadow-sm border border-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
                ${isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'}
              `}
            >
              {isGenerating ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Generating PDF...
                </>
              ) : (
                <>
                  <DownloadCloud size={18} />
                  Download PDF
                </>
              )}
            </button>
            <button
              onClick={async () => {
                setIsGeneratingExcel(true);
                try {
                  const blob = await exportTicketReportExcel();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ticket_report_${new Date().toLocaleDateString()}.xlsx`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  toast.success('Excel report generated successfully');
                } catch (error) {
                  console.error('Excel report generation failed:', error);
                  toast.error(error.message || 'Failed to generate Excel report');
                } finally {
                  setIsGeneratingExcel(false);
                }
              }}
              disabled={isGeneratingExcel}
              className={`w-full flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-base font-medium shadow-sm border border-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
                ${isGeneratingExcel
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'}
              `}
            >
              {isGeneratingExcel ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Generating Excel...
                </>
              ) : (
                <>
                  <DownloadCloud size={18} />
                  Download Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;