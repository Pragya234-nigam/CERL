'use client';
import React from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/appContext';

const Profile = () => {
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid gap-4">
        <Link 
          href="/user/applied-interviews" 
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">My Applied Interviews</h2>
          <p className="text-gray-600">View all interviews you've applied to and their meeting links</p>
        </Link>

        {/* Add more profile sections here as needed */}
      </div>
    </div>
  );
};

export default Profile;