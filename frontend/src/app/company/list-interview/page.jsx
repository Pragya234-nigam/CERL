'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ListInterview = () => {
  const [companyInterviews, setCompanyInterviews] = useState([]);
  const [panelInterviews, setPanelInterviews] = useState([]);

  const fetchCompanyInterviews = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getbycompany`, {
        headers: {
          'x-auth-token': `${localStorage.getItem('company')}`
        }
      });
      setCompanyInterviews(response.data);
      console.log('Company interviews:', response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const fetchPanelInterviews = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/panel/interviews`, {
        headers: {
          'x-auth-token': `${localStorage.getItem('company')}`
        }
      });
      setPanelInterviews(response.data);
      console.log('Panel interviews:', response.data);
    } catch (error) {
      console.error('Error fetching panel interviews:', error);
    }
  }

  const joinMeeting = (meetLink) => {
    if (!meetLink) {
      alert("No meeting link available for this interview.");
      return;
    }
    
    // Check if the link already has the http/https protocol
    if (!meetLink.startsWith('http://') && !meetLink.startsWith('https://')) {
      meetLink = 'https://' + meetLink;
    }
    
    window.open(meetLink, '_blank');
  };

  useEffect(() => {
    fetchCompanyInterviews();
    fetchPanelInterviews();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Interview Dashboard</h1>
      
      {/* Company created interviews */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Interviews Created by Your Company</h2>
        {companyInterviews.length > 0 ? (
          <div className="grid gap-4">
            {companyInterviews.map((interview) => (
              <div key={interview._id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold">{interview.title || 'Untitled Interview'}</h3>
                <p className="text-gray-600">Date: {new Date(interview.date).toLocaleDateString()}</p>
                <p>Status: {interview.status || 'Not specified'}</p>
                {interview.meetLink && (
                  <button 
                    onClick={() => joinMeeting(interview.meetLink)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded"
                  >
                    Join Meeting
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No company interviews found.</p>
        )}
      </div>
      
      {/* Panel interviews */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Interviews You're Invited To</h2>
        {panelInterviews.length > 0 ? (
          <div className="grid gap-4">
            {panelInterviews.map((interview) => (
              <div key={interview._id} className="p-4 border rounded-lg shadow-sm bg-blue-50">
                <h3 className="font-bold">{interview.title || 'Untitled Interview'}</h3>
                <p className="text-gray-600">Date: {new Date(interview.date).toLocaleDateString()}</p>
                <p>Status: {interview.status || 'Not specified'}</p>
                <p className="text-sm text-blue-600">You are a panel member</p>
                {interview.meetLink && (
                  <button 
                    onClick={() => joinMeeting(interview.meetLink)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-4 rounded"
                  >
                    Join Meeting
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No panel interviews found.</p>
        )}
      </div>
    </div>
  )
}

export default ListInterview