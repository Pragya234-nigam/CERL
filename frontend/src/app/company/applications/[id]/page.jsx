'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

const Applications = () => {
  const {id} = useParams();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

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
      console.log(response.data);
      
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
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    let filtered = [...applications];

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.user?.name?.toLowerCase().includes(searchLower) || 
        app.interview?.name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredApplications(filtered);
  }, [filters, applications]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

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

      toast.success('Application status updated successfully');
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

  const handleFeedback = async (applicationId, feedback) => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('Authentication token not found');
      }

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

      toast.success('Feedback added successfully');
    } catch (err) {
      console.error('Error adding feedback:', err);
      toast.error(err.response?.data?.message || 'Failed to add feedback');
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

  const handleRefresh = () => {
    fetchApplications(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
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

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by applicant or interview name..."
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
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-8">
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
                      {application.interview?.name || 'Untitled Interview'}
                    </h3>
                    <p className="text-gray-600">
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
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
                </div>

                {/* Applicant Details */}
                <div>
                  <h4 className="font-medium mb-2">Applicant Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Name:</span>{' '}
                        {application.user?.name}
                      </p>
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
                </div>

                {/* Feedback Section */}
                <div>
                  <h4 className="font-medium mb-2">Feedback</h4>
                  <textarea
                    value={application.feedback || ''}
                    onChange={(e) => handleFeedback(application._id, e.target.value)}
                    placeholder="Add feedback for the applicant..."
                    className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;