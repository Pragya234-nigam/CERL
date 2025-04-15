'use client';

import React from 'react';

const CompanyPage = () => {
    return (
        <section className="bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Company Information Section */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Company</h1>
                    <p className="text-gray-600 leading-relaxed">
                        Welcome to <span className="font-semibold text-blue-500">HireQuest</span>, your trusted partner in connecting talented individuals with top companies. 
                        Our mission is to simplify the hiring process and provide a seamless experience for both employers and job seekers. 
                        Whether you're looking to hire the best talent or searching for your dream job, we've got you covered.
                    </p>
                </div>

                {/* Navigation Links Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Browse Interview */}
                    <a
                        href="/browse-interview"
                        className="block bg-yellow-500 text-white text-center py-4 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300"
                    >
                        Browse Interview
                    </a>    
                    {/* Manage Interview */}
                    <a
                        href="/company/manage-interview"
                        className="block bg-red-500 text-white text-center py-4 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                    >
                        Manage Interview
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CompanyPage;