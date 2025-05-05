'use client';

import React from 'react';
import Link from 'next/link';

const EmployeePage = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Employee Information Section */}
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-12 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Welcome to HireQuest
                        </h1>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Your gateway to exciting career opportunities. We connect talented professionals like you with top companies 
                            across various industries. Take the next step in your career journey with our streamlined interview process 
                            and professional support.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto rounded-full"></div>
                    </div>
                </div>

                {/* Navigation Links Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Browse Interview */}
                    <Link
                        href="/browse-interview"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-1 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    >
                        <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center">
                            <div className="mb-4">
                                <svg className="w-10 h-10 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Browse Interviews</h3>
                            <p className="text-white/80 text-sm">Find your next career opportunity</p>
                        </div>
                    </Link>

                    {/* Profile */}
                    <Link
                        href="/user/profile"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    >
                        <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center">
                            <div className="mb-4">
                                <svg className="w-10 h-10 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Your Profile</h3>
                            <p className="text-white/80 text-sm">Manage your professional profile</p>
                        </div>
                    </Link>

                    {/* Applied Interviews */}
                    <Link
                        href="/user/applied-interviews"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    >
                        <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center">
                            <div className="mb-4">
                                <svg className="w-10 h-10 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Applied Interviews</h3>
                            <p className="text-white/80 text-sm">Track your applications</p>
                        </div>
                    </Link>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    {/* Feature Cards */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-violet-600 mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Verified Companies</h3>
                        <p className="text-gray-600">Connect with legitimate and verified employers</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-violet-600 mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Quick Apply</h3>
                        <p className="text-gray-600">Streamlined application process for faster responses</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-violet-600 mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                        <p className="text-gray-600">Stay informed about your application status</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmployeePage;