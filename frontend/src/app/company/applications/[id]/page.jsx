'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const Applications = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingFeedback, setSavingFeedback] = useState({});
  const [feedbackDraft, setFeedbackDraft] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    skillFilter: '',
    educationLevel: '',
    experienceYears: '',
    hasResume: false
  });

  // Fetch interview details
  const fetchInterviewDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/interview/getbyid/${id}`,
        {
          headers: { 'x-auth-token': token }
        }
      );
      
      setInterview(response.data);
    } catch (err) {
      console.error('Error fetching interview details:', err);
      toast.error('Failed to load interview details');
    }
  }, [id]);

  const fetchApplications = useCallback(async (showRefreshToast = false) => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (showRefreshToast) {
        setRefreshing(true);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/application/getbyinterview/${id}`,
        {
          headers: { 'x-auth-token': token }
        }
      );
      
      setApplications(response.data);
      setFilteredApplications(response.data);
      
      if (showRefreshToast) {
        toast.success('Applications refreshed successfully');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      if (showRefreshToast) {
        toast.error('Failed to refresh applications');
      } else {
        toast.error('Failed to load applications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInterviewDetails();
    fetchApplications();
  }, [fetchInterviewDetails, fetchApplications]);

  useEffect(() => {
    let filtered = [...applications];

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    
    // Name/email search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.user?.name?.toLowerCase().includes(searchLower) || 
        app.user?.email?.toLowerCase().includes(searchLower)
      );
    }
    
    // Skills filter
    if (filters.skillFilter) {
      const skillsLower = filters.skillFilter.toLowerCase();
      filtered = filtered.filter(app => 
        app.user?.skills?.toLowerCase().includes(skillsLower)
      );
    }
    
    // Education level filter
    if (filters.educationLevel) {
      filtered = filtered.filter(app => 
        app.user?.education?.toLowerCase().includes(filters.educationLevel.toLowerCase())
      );
    }
    
    // Experience years filter
    if (filters.experienceYears) {
      filtered = filtered.filter(app => {
        if (!app.user?.experience) return false;
        const expYears = parseInt(app.user.experience);
        return !isNaN(expYears) && expYears >= parseInt(filters.experienceYears);
      });
    }
    
    // Has resume filter
    if (filters.hasResume) {
      filtered = filtered.filter(app => app.user?.resume);
    }

    setFilteredApplications(filtered);
  }, [filters, applications]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Show pending notification
      const statusMessage = newStatus === 'Accepted' ? 'Accepting' : newStatus === 'Rejected' ? 'Rejecting' : 'Updating';
      const pendingToast = toast.loading(`${statusMessage} application...`);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/application/update/${applicationId}`,
        { status: newStatus },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, ...response.data } : app
        )
      );

      // Update the toast notification based on status
      toast.dismiss(pendingToast);
      if (newStatus === 'Accepted' || newStatus === 'Rejected') {
        toast.success(
          <div>
            <p>Application {newStatus.toLowerCase()} successfully</p>
            <p className="text-xs mt-1">Email notification sent to applicant</p>
          </div>, 
          { duration: 4000 }
        );
      } else {
        toast.success('Application status updated successfully');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSchedule = async (applicationId, scheduledTime) => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/application/update/${applicationId}`,
        { scheduledTime },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, ...response.data } : app
        )
      );

      toast.success('Interview scheduled successfully');
    } catch (err) {
      console.error('Error scheduling interview:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleFeedbackChange = (applicationId, feedback) => {
    setFeedbackDraft(prev => ({
      ...prev,
      [applicationId]: feedback
    }));
  };

  const handleFeedbackSave = async (applicationId) => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      setSavingFeedback(prev => ({ ...prev, [applicationId]: true }));
      const feedback = feedbackDraft[applicationId];

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/application/update/${applicationId}`,
        { feedback },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, ...response.data } : app
        )
      );

      // Clear draft after successful save
      setFeedbackDraft(prev => {
        const newDraft = { ...prev };
        delete newDraft[applicationId];
        return newDraft;
      });

      toast.success('Feedback saved successfully');
    } catch (err) {
      console.error('Error saving feedback:', err);
      toast.error(err.response?.data?.message || 'Failed to save feedback');
    } finally {
      setSavingFeedback(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleAddLinks = async (applicationId, { meetingLink, codeLink }) => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/application/update/${applicationId}`,
        { meetingLink, codeLink },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, ...response.data } : app
        )
      );

      toast.success('Links updated successfully');
    } catch (err) {
      console.error('Error updating links:', err);
      toast.error(err.response?.data?.message || 'Failed to update links');
    }
  };

  const viewResume = async (userId) => {
    try {
      if (!userId) {
        toast.error("User ID not available");
        return;
      }

      const token = localStorage.getItem('company');
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // First, check if the user has a resume path
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/resume/${userId}`,
        {
          headers: { 'x-auth-token': token },
          responseType: 'blob' // Important for file downloads
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume. It may not exist or you don't have permission.");
    }
  };

  const previewResume = (userId) => {
    try {
      if (!userId) {
        toast.error("User ID not available");
        return;
      }
      
      // Open resume in a new tab for preview
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/user/resume/${userId}`, '_blank');
    } catch (error) {
      console.error("Error previewing resume:", error);
      toast.error("Failed to preview resume");
    }
  };

  const handleRefresh = () => {
    fetchApplications(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading interview and applications...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Interview Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-2xl font-bold mb-4">Interview Details</h1>
        {interview ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700"><span className="font-medium">Title:</span> {interview.name || 'N/A'}</p>
              <p className="text-gray-700"><span className="font-medium">Date:</span> {interview.interviewDate ? new Date(interview.interviewDate).toLocaleDateString() : 'N/A'}</p>
              <p className="text-gray-700"><span className="font-medium">Time:</span> {interview.interviewTime || 'N/A'}</p>
              <p className="text-gray-700"><span className="font-medium">Status:</span> {interview.status || 'N/A'}</p>
            </div>
            <div>
            <Link href={interview.meetingLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline block">
                    Meeting Link: {interview.meetingLink}
                  </Link>
                  <Link href={interview.codeLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline block mt-1">
                    Code Test Link: {interview.codeLink}
                  </Link>
              <p className="text-gray-700"><span className="font-medium">Panel Size:</span> {interview.panel?.length || 0} members</p>
              <p className="text-gray-700"><span className="font-medium">Created:</span> {interview.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No interview details found.</p>
        )}
      </div>

      {/* Applications Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Applications ({filteredApplications.length})</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors ${
              refreshing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium mb-3">Filters and Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name/Email
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name or email..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                name="skillFilter"
                value={filters.skillFilter}
                onChange={handleFilterChange}
                placeholder="Filter by skills..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education Level
              </label>
              <select
                name="educationLevel"
                value={filters.educationLevel}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Education</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Experience (Years)
              </label>
              <select
                name="experienceYears"
                value={filters.experienceYears}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher</option>
                <option value="0-2 years">0-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6+ years">6+ years</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasResume"
                  name="hasResume"
                  checked={filters.hasResume}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasResume" className="ml-2 block text-sm text-gray-900">
                  Has Resume
                </label>
              </div>
              <button
                onClick={() => setFilters({
                  status: '',
                  search: '',
                  skillFilter: '',
                  educationLevel: '',
                  experienceYears: '',
                  hasResume: false
                })}
                className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No applications match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredApplications.map((application) => (
              <div key={application._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {application.user?.name || 'Unknown Applicant'}
                      </h3>
                      <p className="text-gray-600">
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                          application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      
                      {/* Email notification indicator */}
                      {(application.status === 'Accepted' || application.status === 'Rejected') && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email sent
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div>
                    <h4 className="font-medium mb-2">Applicant Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Email:</span>{' '}
                          {application.user?.email}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Phone:</span>{' '}
                          {application.user?.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Education:</span>{' '}
                          {application.user?.education || 'Not provided'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Experience:</span>{' '}
                          {application.user?.experience || 'Not provided'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Skills:</span>{' '}
                          {application.user?.skills || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Resume section */}
                    <div className="mt-3">
                      {application.user?.resume ? (
                        <div className="flex items-center space-x-3">
                          <span className="text-green-600 font-medium">Resume Available</span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => viewResume(application.user._id)}
                              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded"
                            >
                              Download Resume
                            </button>
                            <button 
                              onClick={() => previewResume(application.user._id)}
                              className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded"
                            >
                              Preview
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-yellow-600">No resume uploaded</span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Feedback</h4>
                    <div className="relative">
                      <textarea
                        value={feedbackDraft[application._id] ?? application.feedback ?? ''}
                        onChange={(e) => handleFeedbackChange(application._id, e.target.value)}
                        placeholder="Add feedback for the applicant..."
                        className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex justify-end mt-2">
                        {feedbackDraft[application._id] !== undefined && 
                         feedbackDraft[application._id] !== application.feedback && (
                            <button
                                onClick={() => handleFeedbackSave(application._id)}
                                disabled={savingFeedback[application._id]}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {savingFeedback[application._id] ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Save Feedback</span>
                                    </>
                                )}
                            </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Links Section */}
                  {application.status === 'Accepted' && (
                    <div>
                      <h4 className="font-medium mb-2">Interview Links</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Meeting Link</label>
                          <input
                            type="text"
                            value={application.meetingLink || ''}
                            onChange={(e) => handleAddLinks(application._id, {
                              meetingLink: e.target.value,
                              codeLink: application.codeLink
                            })}
                            placeholder="Add meeting link..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Code Test Link</label>
                          <input
                            type="text"
                            value={application.codeLink || ''}
                            onChange={(e) => handleAddLinks(application._id, {
                              meetingLink: application.meetingLink,
                              codeLink: e.target.value
                            })}
                            placeholder="Add code test link..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Schedule Section */}
                  {application.status === 'Accepted' && (
                    <div>
                      <h4 className="font-medium mb-2">Schedule Interview</h4>
                      <input
                        type="datetime-local"
                        value={application.scheduledTime ? new Date(application.scheduledTime).toISOString().slice(0, 16) : ''}
                        onChange={(e) => handleSchedule(application._id, e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Resend email notification button */}
                  {(application.status === 'Accepted' || application.status === 'Rejected') && (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('company');
                          if (!token) throw new Error('Authentication token not found');
                          
                          toast.loading('Resending email notification...');
                          
                          await axios.post(
                            `${process.env.NEXT_PUBLIC_API_URL}/application/send-email/${application._id}`,
                            {},
                            { headers: { 'x-auth-token': token } }
                          );
                          
                          toast.dismiss();
                          toast.success('Email notification resent successfully');
                        } catch (error) {
                          toast.dismiss();
                          toast.error('Failed to resend email notification');
                          console.error(error);
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline cursor-pointer"
                    >
                      Resend email notification
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;