'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState(null);

  const fetchCompanyInterviews = async () => {
    try {
      const token = localStorage.getItem('company'); // Assuming the token is stored in localStorage
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
      const token = localStorage.getItem('company');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/interview/delete/${id}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      setInterviews(interviews.filter((interview) => interview._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete interview.');
    }
  };

  const handleUpdate = (id) => {
    // Redirect to the update page or open a modal for editing
    console.log(`Update interview with ID: ${id}`);
    // Example: window.location.href = `/update-interview/${id}`;
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
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id}>
                  <td className="border border-gray-300 px-4 py-2">{interview.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{interview.description}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(interview.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleUpdate(interview._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(interview._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
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