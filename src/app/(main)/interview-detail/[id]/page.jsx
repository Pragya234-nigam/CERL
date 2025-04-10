'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const InterviewDetail = () => {
    const [interviewData, setInterviewData] = useState(null); // State for a single interviewer's data
    const [loading, setLoading] = useState(true); // State for loading
    const { id } = useParams();
    console.log('Interview ID:', id);
    const fetchInterview = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getbyid/${id}`); // Fetch specific interview data using the ID from the URL
             // Fetch specific interview data
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
    return (
        <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
            <div className="text-center">
                <h1 className="text-3xl text-gray-800 font-semibold">Interviewer Detail</h1>
            </div>
            <div className="mt-12 max-w-md mx-auto shadow-lg border rounded-md p-6">
                <h2 className="text-xl font-bold text-gray-900">{interviewData.name}</h2>
                <p className="text-gray-600">Email: {interviewData.email}</p>
                <p className="text-gray-600">Contact No: {interviewData.contactNo}</p>
                <p className="text-gray-600">Skills: {interviewData.skills}</p>
                <p className="text-gray-600">Age: {interviewData.age}</p>
                <p className="text-gray-600">Experience: {interviewData.experience}</p>
                <p className="text-gray-600">Education: {interviewData.education}</p>
                <p className="text-gray-600">Address: {interviewData.address}</p>
                <p className="text-gray-600">Job Type: {interviewData.jobType}</p>
                <p className="text-gray-600">
                    Resume: <a href={interviewData.resume} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Resume</a>
                </p>
            </div>
        </section>
    );
};

export default InterviewDetail;