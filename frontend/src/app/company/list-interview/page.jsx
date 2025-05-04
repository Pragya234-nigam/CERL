'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';

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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/panel-interviews`, {
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

  const codeMeeting = (codeeLink) => {
    if (!codeeLink) {
      alert("No Code link available for this interview.");
      return;
    }
    
    // Check if the link already has the http/https protocol
    if (!codeeLink.startsWith('http://') && !codeeLink.startsWith('https://')) {
      codeeLink = 'https://' + codeeLink;
    }
    
    window.open(codeeLink, '_blank');
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
                <h3 className="font-bold">{interview.name || 'Untitled Interview'}</h3>
                <div className="mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Panel Members: {interview.panel?.length || 0}/5
                  </span>
                </div>
                <p className="text-gray-600">Date: {new Date(interview.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">Interview Date: {new Date(interview.interviewDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Interview Time: {interview.interviewTime}</p>
                
                <div className="mt-2">
                  <Link href={interview.meetingLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline block">
                    Meeting Link: {interview.meetingLink}
                  </Link>
                  <Link href={interview.codeLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline block mt-1">
                    Code Test Link: {interview.codeLink}
                  </Link>
                </div>
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
                <h3 className="font-bold">{interview.name || 'Untitled Interview'}</h3>
                <div className="mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Panel Members: {interview.panel?.length || 0}/5
                  </span>
                </div>
                <p className="text-gray-600">Date: {new Date(interview.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">Interview Date: {new Date(interview.interviewDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Interview Time: {interview.interviewTime}</p>
                
                <div className="mt-2">
                  <Link href={interview.meetingLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline block">
                    Meeting Link: {interview.meetingLink}
                  </Link>
                  <Link href={interview.codeLink} target="_blank" className="text-blue-600 hover:text-blue-800 underline block mt-1">
                    Code Test Link: {interview.codeLink}
                  </Link>
                </div>
                
                <p className="text-sm text-blue-600 mt-2">You are a panel member</p>
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