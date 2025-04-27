'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/appContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user } = useAppContext();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    education: '',
    skills: '',
    experience: '',
    bio: '',
    phone: '',
    location: '',
    resume: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyid`, {
          headers: { 'x-auth-token': user }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    };

    const fetchApplicationStats = async () => {
      try {
        if (!user) return;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/application/getall`, {
          headers: { 'x-auth-token': user }
        });

        const applications = response.data;
        setStats({
          totalApplications: applications.length,
          pendingApplications: applications.filter(app => app.status === 'Pending').length,
          acceptedApplications: applications.filter(app => app.status === 'Accepted').length,
          rejectedApplications: applications.filter(app => app.status === 'Rejected').length
        });
      } catch (error) {
        console.error('Error fetching application stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchApplicationStats();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        profile,
        { headers: { 'x-auth-token': user } }
      );
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'interview');
    fd.append('cloud_name', 'dcvorslf4');

    try {
      const uploadRes = await axios.post('https://api.cloudinary.com/v1_1/dcvorslf4/auto/upload', fd);
      const resumeUrl = uploadRes.data.url;
      console.log(uploadRes);
      
      // Update profile with new resume URL
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        { ...profile, resume: resumeUrl },
        { headers: { 'x-auth-token': user } }
      );

      setProfile(prev => ({ ...prev, resume: resumeUrl }));
      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Application Statistics */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Application Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalApplications}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingApplications}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Accepted</p>
                <p className="text-2xl font-bold text-green-700">{stats.acceptedApplications}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-700">{stats.rejectedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-700"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={profile.education}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={profile.skills}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={profile.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Resume</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={handleResumeUpload}
                      accept=".pdf,.doc,.docx"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                  </div>
                  {profile.resume && (
                    <div className="mt-2">
                      <a 
                        href={profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        View Current Resume
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-4">
              <Link 
                href="/user/applied-interviews" 
                className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">My Applications</h3>
                <p className="text-gray-600">View all your interview applications</p>
              </Link>

              <Link 
                href="/browse-interview" 
                className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">Browse Interviews</h3>
                <p className="text-gray-600">Find new interview opportunities</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;