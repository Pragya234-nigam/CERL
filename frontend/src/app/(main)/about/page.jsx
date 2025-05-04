'use client';
import Link from 'next/link';
import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                {/* Introduction Section */}
                <div className="grid gap-12 row-gap-8 lg:grid-cols-2 items-center">
                    {/* Text Content */}
                    <div className="flex flex-col justify-center">
                        <div className="max-w-xl mb-6 transform hover:scale-105 transition-transform duration-300">
                            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                                HireQuest: A New Era in
                                <span className="inline-block text-violet-700 relative">
                                    <span className="relative z-10">Recruitment and Talent Acquisition</span>
                                    <span className="absolute bottom-0 left-0 w-full h-2 bg-violet-200 -z-0"></span>
                                </span>
                            </h2>
                            <p className="text-base text-gray-700 md:text-lg text-justify leading-relaxed hover:text-gray-900 transition-colors duration-300">
                                HireQuest is a staffing and recruitment company that provides temporary and permanent workforce solutions to businesses across various industries. Specializing in delivering skilled workers for short-term or long-term assignments, HireQuest helps connect employers with qualified candidates, offering flexible staffing services to meet diverse business needs.
                            </p>
                            <p className="text-base text-gray-700 md:text-lg text-justify leading-relaxed mt-4 hover:text-gray-900 transition-colors duration-300">
                                HireQuest is a leading staffing and workforce solutions company that specializes in providing temporary and permanent staffing services across a wide range of industries. With a focus on connecting employers with qualified and skilled workers, HireQuest ensures businesses have the talent they need to succeed in a dynamic and competitive marketplace.
                            </p>
                        </div>
                    </div>

                    {/* Adjacent Image */}
                    <div className="transform hover:scale-105 transition-transform duration-500">
                        <img
                            className="object-cover w-full h-56 rounded-lg shadow-2xl sm:h-96 hover:shadow-3xl transition-shadow duration-300"
                            src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=1260"
                            alt="Recruitment and Talent Acquisition"
                        />
                    </div>
                </div>

                {/* Mission Statement Section */}
                <div className="w-full bg-white rounded-xl shadow-lg py-16 px-6 mt-20 transform hover:scale-[1.02] transition-all duration-300">
                    <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none text-center">
                        <span className="relative">
                            Mission Statement
                            <span className="absolute bottom-0 left-0 w-full h-2 bg-violet-200 -z-0"></span>
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <p className="text-base text-gray-700 md:text-lg leading-relaxed text-justify hover:text-gray-900 transition-colors duration-300">
                            Our mission is to deliver top-quality staffing solutions by leveraging innovative technology, extensive industry knowledge, and a vast network of qualified candidates. We aim to help businesses thrive through flexible, reliable, and tailored workforce solutions while providing workers with meaningful opportunities for career growth.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                className="object-cover w-full h-32 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform"
                                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                alt="Teamwork"
                            />
                            <img
                                className="object-cover w-full h-32 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform"
                                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                alt="Collaboration"
                            />
                            <img
                                className="object-cover w-full h-32 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform"
                                src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                alt="Innovation"
                            />
                            <img
                                className="object-cover w-full h-32 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform"
                                src="https://images.pexels.com/photos/3184631/pexels-photo-3184631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                alt="Growth"
                            />
                        </div>
                    </div>
                </div>

                {/* Our Services Section */}
                <div className="w-full bg-white rounded-xl shadow-lg py-16 px-6 mt-20">
                    <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none text-center">
                        <span className="relative">
                            Our Services
                            <span className="absolute bottom-0 left-0 w-full h-2 bg-violet-200 -z-0"></span>
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Services List */}
                        <ul className="space-y-4 text-gray-700">
                            <li className="text-lg md:text-xl hover:text-violet-600 transition-colors duration-300 flex items-center space-x-2 cursor-pointer transform hover:translate-x-2 transition-transform">
                                <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                <span>Temporary Staffing</span>
                            </li>
                            <li className="text-lg md:text-xl hover:text-violet-600 transition-colors duration-300 flex items-center space-x-2 cursor-pointer transform hover:translate-x-2 transition-transform">
                                <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                <span>Permanent Staffing</span>
                            </li>
                            <li className="text-lg md:text-xl hover:text-violet-600 transition-colors duration-300 flex items-center space-x-2 cursor-pointer transform hover:translate-x-2 transition-transform">
                                <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                <span>Skilled Labor Staffing</span>
                            </li>
                            <li className="text-lg md:text-xl hover:text-violet-600 transition-colors duration-300 flex items-center space-x-2 cursor-pointer transform hover:translate-x-2 transition-transform">
                                <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                <span>On-Demand Workforce Solutions</span>
                            </li>
                            <li className="text-lg md:text-xl hover:text-violet-600 transition-colors duration-300 flex items-center space-x-2 cursor-pointer transform hover:translate-x-2 transition-transform">
                                <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                <span>Industry-Specific Staffing</span>
                            </li>
                        </ul>

                        {/* Adjacent Image */}
                        <div className="transform hover:scale-105 transition-transform duration-500">
                            <img
                                className="object-cover w-full h-56 rounded-lg shadow-2xl sm:h-96 hover:shadow-3xl transition-shadow duration-300"
                                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                alt="Our Services"
                            />
                        </div>
                    </div>
                </div>

                {/* Why Choose HireQuest Section */}
                <div className="w-full bg-white rounded-xl shadow-lg py-16 px-6 mt-20 mb-20">
                    <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none text-center">
                        <span className="relative">
                            Why Choose HireQuest?
                            <span className="absolute bottom-0 left-0 w-full h-2 bg-violet-200 -z-0"></span>
                        </span>
                    </h2>
                    <p className="text-base text-gray-700 md:text-lg leading-relaxed text-justify hover:text-gray-900 transition-colors duration-300">
                        HireQuest is a staffing and recruitment company that provides temporary and permanent workforce solutions to businesses across various industries. Specializing in delivering skilled workers for short-term or long-term assignments, HireQuest helps connect employers with qualified candidates, offering flexible staffing services to meet diverse business needs.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;