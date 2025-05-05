'use client';

import Link from 'next/link';
import React from 'react';

const CompanyPage = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Company Information Section */}
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-12 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Welcome to HireQuest
                        </h1>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Your trusted partner in connecting talented individuals with top companies. 
                            Our mission is to simplify the hiring process and provide a seamless experience for both employers and job seekers. 
                            Whether you're looking to hire the best talent or searching for your dream job, we've got you covered.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
                    </div>
                </div>

                {/* Navigation Links Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Browse Interview */}
                    <Link
                        href="/browse-interview"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    >
                        <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center">
                            <div className="mb-4">
                                <svg className="w-10 h-10 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Browse Interview</h3>
                            <p className="text-white/80 text-sm">Explore available interview opportunities</p>
                        </div>
                    </Link>
                    
                    {/* Manage Interview */}
                    <Link
                        href="/company/manage-interview"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-1 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    >
                        <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center">
                            <div className="mb-4">
                                <svg className="w-10 h-10 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Manage Interview</h3>
                            <p className="text-white/80 text-sm">Review and manage your interviews</p>
                        </div>
                    </Link>

                    {/* Interview Form */}
                    <Link
                        href="/company/add-interview"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    >
                        <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center">
                            <div className="mb-4">
                                <svg className="w-10 h-10 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Interview Form</h3>
                            <p className="text-white/80 text-sm">Create a new interview listing</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CompanyPage;