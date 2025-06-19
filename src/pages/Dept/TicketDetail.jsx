import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, User, Calendar, Clock, Building2, Mail, Phone, MapPin, FileText, Download, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { getDepartmentTickets, getDepartmentAttachment } from '../../service/deptAuthService';
import { useDeptAuth } from '../../context/DeptAuthContext';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const { deptAdmin } = useDeptAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [attachmentType, setAttachmentType] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const result = await getDepartmentTickets();
        
        if (result.success) {
          const foundTicket = result.tickets.find(t => t._id === ticketId);
          
          if (!foundTicket) {
            throw new Error('Ticket not found');
          }
          
          setTicket(foundTicket);
        } else {
          throw new Error(result.message || 'Failed to fetch tickets');
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        toast.error('Failed to load ticket details');
        // Fallback to static data for demo
        setTicket({
          _id: ticketId,
          title: "Printer not working in Lab 101",
          description: "The printer in Lab 101 is showing error messages and not printing. The error code displayed is E-04. This is affecting students who need to print their assignments.",
          status: "pending",
          priority: "medium",
          createdAt: "2024-03-20T10:00:00Z",
          raised_by: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 234 567 8900",
            department: "Computer Science"
          },
          from_department: "Computer Science",
          to_department: {
            name: deptAdmin?.department || "IT Department"
          },
          attachment: "printer-error-screenshot.png"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId, deptAdmin]);

  // Clean up attachment URL on unmount
  useEffect(() => {
    return () => {
      if (attachmentUrl) {
        window.URL.revokeObjectURL(attachmentUrl);
      }
    };
  }, [attachmentUrl]);

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
        return <Clock size={16} />;
      case 'in_progress':
        return <AlertCircle size={16} />;
      case 'resolved':
        return <AlertCircle size={16} />;
      case 'revoked':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'low':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const formatAttachmentName = (attachmentName) => {
    if (!attachmentName) return '';
    
    // Split by dash and get the last part (filename)
    const parts = attachmentName.split('-');
    if (parts.length > 1) {
      // Remove the first part (timestamp) and join the rest
      return parts.slice(1).join('-');
    }
    
    // If no dash found, return the original name
    return attachmentName;
  };

  const handleAttachmentClick = async (attachmentName) => {
    try {
      // If the same attachment is clicked again, toggle it off
      if (attachmentUrl) {
        window.URL.revokeObjectURL(attachmentUrl);
        setAttachmentUrl(null);
        setAttachmentType(null);
        return;
      }

      const result = await getDepartmentAttachment(attachmentName);
      
      if (result.success) {
        const blob = await result.data.blob();
        const url = window.URL.createObjectURL(blob);

        // Determine file type based on extension
        const extension = attachmentName.split('.').pop().toLowerCase();
        let type;
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
          type = 'image';
        } else if (extension === 'pdf') {
          type = 'pdf';
        } else {
          type = 'unsupported';
        }

        setAttachmentUrl(url);
        setAttachmentType(type);
      } else {
        toast.error(result.message || 'Failed to fetch attachment');
      }
    } catch (error) {
      console.error('Error fetching attachment:', error);
      toast.error('Failed to fetch attachment');
    }
  };

  const handleDownloadAttachment = async (attachmentName) => {
    try {
      toast.info('Downloading attachment...');
      
      const result = await getDepartmentAttachment(attachmentName);
      
      if (result.success) {
        const blob = await result.data.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = attachmentName; // Use original filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        window.URL.revokeObjectURL(url);
        
        toast.success('Attachment downloaded successfully');
      } else {
        toast.error(result.message || 'Failed to download attachment');
      }
    } catch (error) {
      console.error('Error downloading attachment:', error);
      toast.error('Failed to download attachment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/dept/tickets"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Tickets
        </Link>
      </div>

      {ticket && (
        <div className="space-y-6">
          {/* Main Ticket Info */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
                <p className="text-gray-600">Ticket ID: {ticket._id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(ticket.priority).bg} ${getPriorityColor(ticket.priority).text} ${getPriorityColor(ticket.priority).border}`}>
                  {ticket.priority?.toUpperCase() || 'MEDIUM'}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(ticket.status).bg} ${getStatusColor(ticket.status).text} ${getStatusColor(ticket.status).border}`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">From Department</h3>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" />
                    <span className="text-gray-900">{ticket.from_department}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">To Department</h3>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" />
                    <span className="text-gray-900">{ticket.to_department?.name || ticket.to_department}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Created</h3>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Last Updated</h3>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requester Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-900 font-medium">{ticket.raised_by?.name}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-900">{ticket.raised_by?.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {ticket.raised_by?.phone && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-900">{ticket.raised_by.phone}</span>
                    </div>
                  </div>
                )}
                
                {ticket.raised_by?.department && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Department</h4>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-gray-900">{ticket.raised_by.department}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          {ticket.attachment && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{formatAttachmentName(ticket.attachment)}</p>
                      <p className="text-sm text-gray-500">Click to preview or download</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAttachmentClick(ticket.attachment)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownloadAttachment(ticket.attachment)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>

                {attachmentUrl && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    {attachmentType === 'image' && (
                      <div className="text-center">
                        <img
                          src={attachmentUrl}
                          alt="Attachment"
                          className="max-w-full h-auto rounded-lg border border-gray-200 mx-auto"
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                    )}
                    {attachmentType === 'pdf' && (
                      <div className="text-center">
                        <iframe
                          src={attachmentUrl}
                          title="Attachment PDF"
                          className="w-full h-96 border border-gray-200 rounded-lg"
                        />
                      </div>
                    )}
                    {attachmentType === 'unsupported' && (
                      <div className="text-center">
                        <p className="text-sm text-red-600 mb-2">
                          This file type is not supported for preview.
                        </p>
                        <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Please download the file to view it.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toast.info('Update status feature would be implemented here')}
                disabled={ticket.status === 'revoked'}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ticket.status === 'revoked'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Update Status
              </button>
              <button
                onClick={() => toast.info('Add comment feature would be implemented here')}
                disabled={ticket.status === 'revoked'}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ticket.status === 'revoked'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                Add Comment
              </button>
              {ticket.status === 'revoked' && (
                <div className="w-full mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This ticket has been revoked. Status updates and comments are disabled.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail; 