'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/appContext';
import toast from 'react-hot-toast';

const AppliedInterviews = () => {
  const [appliedInterviews, setAppliedInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppContext();

  const fetchAppliedInterviews = async () => {
    try {
      if (!user) {
        toast.error('Please login to view your applications');
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/application/getall`, {
        headers: {
          'x-auth-token': user
        }
      });
      
      // Since the backend now populates the interview data, we can use it directly
      setAppliedInterviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applied interviews:', error);
      const errorMsg = error.response?.data?.message || 'Failed to fetch your applications';
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  const joinMeeting = (meetLink) => {
    if (!meetLink) {
      toast.error("No meeting link available for this interview.");
      return;
    }
    
    // Check if the link already has the http/https protocol
    if (!meetLink.startsWith('http://') && !meetLink.startsWith('https://')) {
      meetLink = 'https://' + meetLink;
    }
    
    window.open(meetLink, '_blank');
  };

  const codeMeeting = (codeeLink) => {
    if (!codeeLink) {
      toast.error("No Code link available for this interview.");
      return;
    }
    
    // Check if the link already has the http/https protocol
    if (!codeeLink.startsWith('http://') && !codeeLink.startsWith('https://')) {
      codeeLink = 'https://' + codeeLink;
    }
    
    window.open(codeeLink, '_blank');
  };

  useEffect(() => {
    fetchAppliedInterviews();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Applied Interviews</h1>
      
      {appliedInterviews.length === 0 ? (
        <p className="text-gray-600">You haven't applied to any interviews yet.</p>
      ) : (
        <div className="grid gap-4">
          {appliedInterviews.map((application) => (
            <div key={application._id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-bold">{application.interview?.name || 'Untitled Interview'}</h3>
              <p className="text-gray-600">Applied Date: {new Date(application.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600">Interview Date: {new Date(application.interview?.interviewDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Interview Time: {application.interview?.interviewTime}</p>
              
              {application.interview?.meetingLink && (
                <button 
                  onClick={() => joinMeeting(application.interview.meetingLink)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded"
                >
                  Join Meeting
                </button>
              )}
              {application.interview?.codeLink && (
                <button 
                  onClick={() => codeMeeting(application.interview.codeLink)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded"
                >
                  code Link
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedInterviews;