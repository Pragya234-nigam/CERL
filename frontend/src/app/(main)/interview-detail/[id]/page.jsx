'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/context/appContext'; // Import the AppContext

const InterviewDetail = () => {
    const [interviewData, setInterviewData] = useState(null); // State for a single interviewer's data
    const [loading, setLoading] = useState(true); // State for loading
    const { id } = useParams();
    const { company } = useAppContext(); // Access the company object from the context
    console.log('Interview ID:', id);

    const fetchInterview = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getbyid/${id}`); // Fetch specific interview data using the ID from the URL
            console.log(res.data);
            setInterviewData(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching interview data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterview();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-12">Loading...</div>;
    }

    if (!interviewData) {
        return <div className="text-center mt-12">No Interviewer Found</div>;
    }

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('user'); // Assuming the user token is stored in localStorage
            if (!token) {
                toast.error('You must be logged in to apply.');
                return;
            }

            const applicationData = {
                interviewId: id,
                userId: 'currentUserId', // Replace with the actual user ID if available
            };

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/application/add`, applicationData, {
                headers: {
                    'x-auth-token': token,
                },
            });

            toast.success('Application submitted successfully!');
            console.log('Application Response:', res.data);
        } catch (error) {
            console.error('Error applying to the interview:', error);
            toast.error('Failed to submit application.');
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
        } catch (error) {
            console.error('Error joining the panel:', error.response?.data || error.message);
            toast.error('Failed to join the panel.');
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
                    <button
                        onClick={handleApply}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleJoinPanel}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                        Join Panel
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InterviewDetail;