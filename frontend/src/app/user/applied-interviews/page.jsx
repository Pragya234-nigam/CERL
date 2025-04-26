'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AppliedInterviews = () => {
  const [appliedInterviews, setAppliedInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('date-desc');

  const fetchAppliedInterviews = useCallback(async (showRefreshToast = false) => {
    try {
      const token = localStorage.getItem('user');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (showRefreshToast) {
        setRefreshing(true);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/application/getall`,
        {
          headers: { 'x-auth-token': token }
        }
      );

      setAppliedInterviews(response.data);
      setFilteredInterviews(response.data);
      setError(null);
      
      if (showRefreshToast) {
        toast.success('Applications refreshed successfully');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to fetch applications');
      if (showRefreshToast) {
        toast.error('Failed to refresh applications');
      } else {
        toast.error('Failed to load your applications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppliedInterviews();
  }, [fetchAppliedInterviews]);

  useEffect(() => {
    let filtered = [...appliedInterviews];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    if (filters.date) {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.createdAt).toLocaleDateString();
        return appDate.includes(filters.date);
      });
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.interview?.name?.toLowerCase().includes(searchLower) ||
        app.interview?.jobType?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name-asc':
          return (a.interview?.name || '').localeCompare(b.interview?.name || '');
        case 'name-desc':
          return (b.interview?.name || '').localeCompare(a.interview?.name || '');
        default:
          return 0;
      }
    });

    setFilteredInterviews(filtered);
  }, [filters, sortBy, appliedInterviews]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      date: '',
      search: ''
    });
    setSortBy('date-desc');
  };

  const handleRefresh = () => {
    fetchAppliedInterviews(true);
  };

  const openLink = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Link not available');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading your applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-600 text-center mb-4">
          <p className="text-lg font-semibold mb-2">Error loading applications</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2 ${
            refreshing ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search interviews..."
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
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Reset Filters
        </button>
      </div>

      {/* Applications List */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No applications match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredInterviews.map((application) => (
            <div key={application._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status}
                  </div>
                </div>

                {/* Interview Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Interview Date:</span>{' '}
                      {new Date(application.interview?.interviewDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Interview Time:</span>{' '}
                      {application.interview?.interviewTime}
                    </p>
                    {application.scheduledTime && (
                      <p className="text-blue-600 font-medium">
                        Scheduled for: {new Date(application.scheduledTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Job Type:</span>{' '}
                      {application.interview?.jobType}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Company:</span>{' '}
                      {application.interview?.company?.name || 'Company name not available'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Required Skills:</span>{' '}
                      {application.interview?.skills}
                    </p>
                  </div>
                </div>

                {/* Feedback Section */}
                {application.feedback && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Feedback</h4>
                    <p className="text-gray-700">{application.feedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {(application.status === 'Accepted' || application.scheduledTime) && (
                  <div className="flex flex-wrap gap-3">
                    {application.interview?.meetingLink && (
                      <button 
                        onClick={() => openLink(application.interview.meetingLink)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Join Meeting
                      </button>
                    )}
                    {application.interview?.codeLink && (
                      <button 
                        onClick={() => openLink(application.interview.codeLink)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Open Code Test
                      </button>
                    )}
                  </div>
                )}

                {/* Status Messages */}
                {application.status === 'Pending' && (
                  <p className="text-gray-500 italic">
                    Your application is being reviewed. We'll notify you when there's an update.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedInterviews;