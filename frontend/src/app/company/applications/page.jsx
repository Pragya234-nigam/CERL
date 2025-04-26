'use client';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import toast from 'react-hot-toast';

const CompanyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        applicantName: '',
        date: '',
        education: ''
    });
    const { company } = useAppContext();

    const fetchApplications = useCallback(async (showRefreshToast = false) => {
        try {
            if (!company) {
                throw new Error('Please login as a company to view applications');
            }

            if (showRefreshToast) {
                setRefreshing(true);
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/application/company/applications`,
                { headers: { 'x-auth-token': company } }
            );

            setApplications(response.data);
            setError(null);
            
            if (showRefreshToast) {
                toast.success('Applications refreshed successfully');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch applications';
            setError(errorMessage);
            if (showRefreshToast) {
                toast.error(errorMessage);
            } else {
                toast.error('Failed to load applications');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [company]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    useEffect(() => {
        const filtered = applications.filter(app => {
            const applicantName = `${app.user?.fname} ${app.user?.lname}`.toLowerCase();
            return (
                (!filters.status || app.status === filters.status) &&
                (!filters.applicantName || applicantName.includes(filters.applicantName.toLowerCase())) &&
                (!filters.date || new Date(app.createdAt).toLocaleDateString().includes(filters.date)) &&
                (!filters.education || app.user?.education?.toLowerCase().includes(filters.education.toLowerCase()))
            );
        });
        setFilteredApplications(filtered);
    }, [filters, applications]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            applicantName: '',
            date: '',
            education: ''
        });
    };

    const handleRefresh = () => {
        fetchApplications(true);
    };

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/application/update/${applicationId}`,
                { status: newStatus },
                { headers: { 'x-auth-token': company } }
            );

            // Update the application in the list with the full updated data
            setApplications(apps => 
                apps.map(app => 
                    app._id === applicationId 
                        ? response.data  // Use the full updated application from the response
                        : app
                )
            );

            toast.success(`Application ${newStatus.toLowerCase()} successfully`);
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error(error.response?.data?.message || 'Failed to update application status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg font-semibold text-gray-700">Loading applications...</div>
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
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Interview Applications</h1>
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
            
            {/* Filters Section */}
            <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border p-2 rounded focus:ring focus:ring-blue-300"
                    >
                        <option value="">Filter by Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <input
                        type="text"
                        name="applicantName"
                        placeholder="Search by applicant name"
                        value={filters.applicantName}
                        onChange={handleFilterChange}
                        className="border p-2 rounded focus:ring focus:ring-blue-300"
                    />

                    <input
                        type="text"
                        name="date"
                        placeholder="Filter by date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="border p-2 rounded focus:ring focus:ring-blue-300"
                    />

                    <input
                        type="text"
                        name="education"
                        placeholder="Filter by education"
                        value={filters.education}
                        onChange={handleFilterChange}
                        className="border p-2 rounded focus:ring focus:ring-blue-300"
                    />
                </div>
                <button
                    onClick={clearFilters}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Clear Filters
                </button>
            </div>
            
            {filteredApplications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No applications match your filters.</p>
            ) : (
                <div className="space-y-6">
                    {filteredApplications.map((application) => (
                        <div key={application._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                                        Interview: {application.interview?.name || 'Untitled Interview'}
                                    </h2>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Applicant Name:</span> {application.user?.fname} {application.user?.lname}</p>
                                        <p><span className="font-medium">Email:</span> {application.user?.email}</p>
                                        <p><span className="font-medium">Applied Date:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
                                        <p><span className="font-medium">Interview Date:</span> {new Date(application.interview?.interviewDate).toLocaleDateString()}</p>
                                        <p><span className="font-medium">Education:</span> {application.user?.education || 'Not specified'}</p>
                                        <p><span className="font-medium">Status:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                                application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {application.status || 'Pending'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 md:text-right">
                                    {application.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => updateApplicationStatus(application._id, 'Accepted')}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateApplicationStatus(application._id, 'Rejected')}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyApplications;