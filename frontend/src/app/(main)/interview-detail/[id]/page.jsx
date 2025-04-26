'use client';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/context/appContext';
import Link from 'next/link';

const InterviewDetail = () => {
    const router = useRouter();
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [isInPanel, setIsInPanel] = useState(false);
    const [panelCount, setPanelCount] = useState(0);
    const { id } = useParams();
    const { company, user } = useAppContext();

    const checkPanelStatus = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getbyid/${id}`);
            if (res.data && company) {
                const tokenData = JSON.parse(atob(company.split('.')[1]));
                const companyId = tokenData._id;
                setIsInPanel(res.data.panel?.includes(companyId));
                setPanelCount(res.data.panel?.length || 0);
            }
        } catch (error) {
            console.error('Error checking panel status:', error);
        }
    };

    const checkApplicationStatus = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/application/check/${id}`, {
                headers: { 'x-auth-token': user }
            });
            setHasApplied(response.data.hasApplied);
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getbyid/${id}`);
                setInterviewData(res.data);
                if (user) {
                    await checkApplicationStatus();
                }
                if (company) {
                    await checkPanelStatus();
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching interview:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, company]);

    const handleJoinPanel = async () => {
        try {
            if (!company) {
                toast.error('Please login as a company to join the panel');
                return;
            }

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/interview/join/${id}`,
                {},
                { headers: { 'x-auth-token': company } }
            );

            toast.success('Successfully joined the panel!');
            setIsInPanel(true);
        } catch (error) {
            console.error('Error joining panel:', error);
            toast.error(error.response?.data?.message || 'Failed to join panel');
        }
    };

    const handleApply = async () => {
        try {
            if (!user) {
                toast.error('You must be logged in to apply.');
                return;
            }

            // Decode the JWT token to get user info
            const tokenData = JSON.parse(atob(user.split('.')[1]));
            const userId = tokenData._id;

            const applicationData = {
                interviewId: id,
                userId: userId
            };

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/application/add`, applicationData, {
                headers: {
                    'x-auth-token': user,
                },
            });

            toast.success('Application submitted successfully!');
            setHasApplied(true); // Update application status
            router.push('/user/applied-interviews'); // Redirect to applied interviews page
        } catch (error) {
            console.error('Error applying to the interview:', error);
            toast.error(error.response?.data?.error || 'Failed to submit application.');
        }
    };

    if (loading) {
        return <div className="text-center mt-12">Loading...</div>;
    }

    if (!interviewData) {
        return <div className="text-center mt-12">Interview not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={interviewData.image || '/default-avatar.png'}
                        alt={interviewData.name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{interviewData.name}</h1>
                        <p className="text-gray-600">{interviewData.jobType}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <p className="text-gray-700"><strong>Description:</strong> {interviewData.description}</p>
                    <p className="text-gray-700"><strong>Skills Required:</strong> {interviewData.skills}</p>
                    <p className="text-gray-700"><strong>Experience:</strong> {interviewData.experience}</p>
                    <p className="text-gray-700"><strong>Education:</strong> {interviewData.education}</p>
                    <p className="text-gray-700"><strong>Age Category:</strong> {interviewData.age}</p>
                    <p className="text-gray-700"><strong>Interview Date:</strong> {new Date(interviewData.interviewDate).toLocaleDateString()}</p>
                    <p className="text-gray-700"><strong>Interview Time:</strong> {interviewData.interviewTime}</p>
                    <p className="text-gray-700"><strong>Location:</strong> {interviewData.address}</p>
                    <p className="text-gray-700"><strong>Contact:</strong> {interviewData.contactNo}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {interviewData.email}</p>
                    
                    {(company || hasApplied) && (
                        <>
                            <Link href={interviewData.meetingLink} target='_blank' className='text-gray-600'>Meeting Link: {interviewData.meetingLink}</Link><br></br>
                            <Link href={interviewData.codeLink} target='_blank' className='text-gray-600'>Code Link: {interviewData.codeLink}</Link>
                        </>
                    )}
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    {company ? (
                        isInPanel ? (
                            <div className="bg-green-100 text-green-700 p-3 rounded-md">
                                You are already a member of this panel
                            </div>
                        ) : (
                            <button
                                onClick={handleJoinPanel}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                            >
                                Join Panel
                            </button>
                        )
                    ) : user ? (
                        hasApplied ? (
                            <div className="bg-green-100 text-green-700 p-3 rounded-md">
                                You have already applied for this interview
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                            >
                                Apply Now
                            </button>
                        )
                    ) : (
                        <p className="text-red-600">Please login to interact with this interview</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewDetail;