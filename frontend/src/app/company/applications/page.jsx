'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import toast from 'react-hot-toast';

const CompanyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        applicantName: '',
        date: '',
        education: ''
    });
    const { company } = useAppContext();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                if (!company) {
                    toast.error('Please login as a company to view applications');
                    return;
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/application/company/applications`,
                    { headers: { 'x-auth-token': company } }
                );

                setApplications(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching applications:', error);
                toast.error('Failed to fetch applications');
                setLoading(false);
            }
        };

        fetchApplications();
    }, [company]);

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

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/application/update/${applicationId}`,
                { status: newStatus },
                { headers: { 'x-auth-token': company } }
            );

            setApplications(apps => 
                apps.map(app => 
                    app._id === applicationId 
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            toast.success(`Application ${newStatus.toLowerCase()}`);
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error('Failed to update application status');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Interview Applications</h1>
            
            {/* Filters */}
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
                <p className="text-gray-600">No applications match your filters.</p>
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
                                        <p><span className="font-medium">Interview Date:</span> {new Date(application.interview?.date).toLocaleDateString()}</p>
                                        <p><span className="font-medium">Status:</span> {application.status || 'Pending'}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 md:text-right">
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