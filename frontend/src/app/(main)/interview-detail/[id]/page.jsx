'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/context/appContext'; // Import the AppContext
import Link from 'next/link';


const InterviewDetail = () => {
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const { id } = useParams();
    const { user } = useAppContext();

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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching interview:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    if (loading) {
        return <div className="text-center mt-12">Loading...</div>;
    }

    if (!interviewData) {
        return <div className="text-center mt-12">No Interviewer Found</div>;
    }

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
            console.log('Application Response:', res.data);
            setHasApplied(true); // Update application status
        } catch (error) {
            console.error('Error applying to the interview:', error);
            toast.error(error.response?.data?.error || 'Failed to submit application.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <img src={interviewData.image} alt="interview" className="w-16 h-16 rounded-full object-cover mx-auto" />
                <h2 className="text-xl font-bold text-gray-900 text-center mt-4">{interviewData.name}</h2>
                <p className="text-gray-600 text-center">Email: {interviewData.email}</p>
                <p className="text-gray-600 text-center">Contact No: {interviewData.contactNo}</p>
                <p className="text-gray-600">Skills: {interviewData.skills}</p>
                <p className="text-gray-600">Age: {interviewData.age}</p>
                <p className="text-gray-600">Experience: {interviewData.experience}</p>
                <p className="text-gray-600">Education: {interviewData.education}</p>
                <p className="text-gray-600">Address: {interviewData.address}</p>
                <p className="text-gray-600">Job Type: {interviewData.jobType}</p>
                <p className="text-gray-600">interviewDate: {interviewData.interviewDate}</p>
                <p className='text-gray-600'>InterviewTime: {interviewData.interviewTime}</p>
                <Link href={interviewData.meetingLink} target='_blank' className='text-gray-600'>MeetingLink: {interviewData.meetingLink}</Link>
                <div className="mt-6 flex justify-center gap-4">
                    {user ? (
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
                        <p className="text-red-600">Please login to apply for this interview</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewDetail;