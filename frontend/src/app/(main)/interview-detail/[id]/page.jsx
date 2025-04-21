'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/context/appContext'; // Import the AppContext


const InterviewDetail = () => {
    const companyToken = localStorage.getItem('company'); // Retrieve the user token from local storage
    const [interviewData, setInterviewData] = useState(null); // State for a single interviewer's data
    const [loading, setLoading] = useState(true); // State for loading
    const [hasApplied, setHasApplied] = useState(false); // State for application status
    const [isInPanel, setIsInPanel] = useState(false); // State for panel membership
    const { id } = useParams();
    const { company, user } = useAppContext(); // Access the company and user objects from the context
    // console.log('Interview ID:', id);

    const fetchInterview = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getbyid/${id}`); // Fetch specific interview data using the ID from the URL
            console.log(res.data);
            setInterviewData(res.data);
            // Check if current company is in panel
            if (companyToken) {
                // const tokenData = JSON.parse(atob(company.split('.')[1]));
                // console.log(tokenData);
                checkApplicationStatus(res.data); // Check if the user has already applied
                // setIsInPanel(res.data.panel.includes(tokenData._id));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching interview data:', error);
            setLoading(false);
        }
    };

    const checkApplicationStatus = async (data) => {
        // console.log(companyToken);
        
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/company/getcompany`, {
                headers: {
                    'x-auth-token': companyToken, // Pass the user token in the headers
                }
            });
            console.log(res.data);
            setIsInPanel(data.panel.includes(res.data._id)); // Check if the user has already applied
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    useEffect(() => {
        fetchInterview();
        if (user) {
            checkApplicationStatus();
        }
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

    const handleJoinPanel = async () => {
        try {
            const token = localStorage.getItem('company'); // Retrieve the company token
            console.log('Company Token:', token);
            if (!token) {
                toast.error('You must be logged in as a company to join the panel.');
                return;
            }

            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/interview/join/${id}`, {}, {
                headers: {
                    'x-auth-token': token,
                },
            });

            console.log('Join Panel Response:', res.data);
            toast.success('Successfully joined the panel!');
            setIsInPanel(true);
        } catch (error) {
            console.error('Error joining the panel:', error);
            const errorMessage = error.response?.data?.message || 'Failed to join the panel.';
            toast.error(errorMessage);
        }
    };

    return (
        <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
            <div className="text-center">
                <h1 className="text-3xl text-gray-800 font-semibold">Interviewer Detail</h1>
            </div>
            <div className="mt-12 max-w-md mx-auto shadow-lg border rounded-md p-6">
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
                <p className="text-gray-600">
                    Resume: <a href={interviewData.resume} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Resume</a>
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    {user ? (
                        hasApplied ? (
                            <button
                                disabled
                                className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
                            >
                                Already Applied
                            </button>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Apply
                            </button>
                        )
                    ) : company ? (
                        isInPanel ? (
                            <button
                                disabled
                                className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
                            >
                                Already in Panel
                            </button>
                        ) : (
                            <button
                                onClick={handleJoinPanel}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                            >
                                Join Panel
                            </button>
                        )
                    ) : (
                        <button
                            onClick={() => toast.error('Please login as a user or company to proceed.')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Login to Continue
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default InterviewDetail;