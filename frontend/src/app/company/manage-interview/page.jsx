'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ManageInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchCompanyInterviews = async () => {
    try {
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getbycompany`, {
        headers: {
          'x-auth-token': token,
        },
      });

      setInterviews(res.data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch interviews.');
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!confirm('Are you sure you want to delete this interview?')) {
        return;
      }

      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/interview/delete/${id}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      toast.success('Interview deleted successfully');
      setInterviews(interviews.filter((interview) => interview._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to delete interview.');
    }
  };

  const handleUpdate = async (id) => {
    try {
      // Get the interview data
      const interview = interviews.find(i => i._id === id);
      if (!interview) {
        throw new Error('Interview not found');
      }

      // Store the interview data in localStorage for the update form
      localStorage.setItem('updateInterview', JSON.stringify(interview));
      
      // Redirect to the add-interview page with update parameter
      router.push(`/company/add-interview?update=${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to prepare interview update.');
    }
  };

  useEffect(() => {
    fetchCompanyInterviews();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Interviews</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {interviews.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Interview Date</th>
                <th className="border border-gray-300 px-4 py-2">Interview Time</th>
                <th className="border border-gray-300 px-4 py-2">Interview Link</th>
                <th className="border border-gray-300 px-4 py-2">Code Link</th>
                <th className="border border-gray-300 px-4 py-2">Panel Count</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id}>
                  <td className="border border-gray-300 px-4 py-2">{interview.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(interview.interviewDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                  {interview.interviewTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link href={interview.meetingLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                      {interview.meetingLink}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link href={interview.codeLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                      {interview.codeLink}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {interview.panel?.length || 0}/5
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleUpdate(interview._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <Link href={'/company/applications/'+interview._id}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={() => handleDelete(interview._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                
              ))}
             
            </tbody>
          </table>
        ) : (
          <p>No interviews found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageInterview;