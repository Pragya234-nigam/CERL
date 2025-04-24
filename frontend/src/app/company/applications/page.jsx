'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import toast from 'react-hot-toast';

const CompanyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
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
            
            {applications.length === 0 ? (
                <p className="text-gray-600">No applications received yet.</p>
            ) : (
                <div className="space-y-6">
                    {applications.map((application) => (
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