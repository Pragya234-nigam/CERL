'use client';
import Link from 'next/link';
import React from 'react'
const About = () => {
    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="grid gap-12 row-gap-8 lg:grid-cols-2">
                <div className="flex flex-col justify-center">
                    <div className="max-w-xl mb-6">
                        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                            HireQuest: A New Era in
                            <span className="inline-block text-violet-700">
                                Recruitment and  Talent Acquisition
                            </span>
                        </h2>

                        <p className="text-base text-gray-700 md:text-lg">
                            HireQuest is a staffing and recruitment company that provides temporary and permanent workforce solutions to businesses across various industries. Specializing in delivering skilled workers for short-term or long-term assignments, HireQuest helps connect employers with qualified candidates, offering flexible staffing services to meet diverse business needs.
                        </p>
                        <p className="text-base text-gray-700 md:text-lg">
                            HireQuest is a leading staffing and workforce solutions company that specializes in providing temporary and permanent staffing services across a wide range of industries. With a focus on connecting employers with qualified and skilled workers, HireQuest ensures businesses have the talent they need to succeed in a dynamic and competitive marketplace.</p>
                        <br />
                        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Mission Statement</h2><p className="text-base text-gray-700 md:text-lg">
                            Our mission is to deliver top-quality staffing solutions by leveraging innovative technology, extensive industry knowledge, and a vast network of qualified candidates. We aim to help businesses thrive through flexible, reliable, and tailored workforce solutions while providing workers with meaningful opportunities for career growth.</p> <br />
                        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Our Services</h2>
                        <li>Temporary Staffing</li>
                        <li>Permanent Staffing</li>
                        <li>Skilled Labor Staffing</li>
                        <li>On-Demand Workforce Solutions</li>
                        <li>Industry-Specific Staffing</li><br />
                        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Why choose HireQuest?</h2>
                        <p className="text-base text-gray-700 md:text-lg">
                            <p className="text-base text-gray-700 md:text-lg">
                                HireQuest is a staffing and recruitment company that provides temporary and permanent workforce solutions to businesses across various industries. Specializing in delivering skilled workers for short-term or long-term assignments, HireQuest helps connect employers with qualified candidates, offering flexible staffing services to meet diverse business needs.
                            </p>
                        </p>
                    </div>
                       <p className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Choose between Company or Employeer</p>
                    <div><>
                        <Link
                            href="/company-login"
                            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Company
                        </Link>
                        <Link
                            href="/login"
                            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                        >
                            Employer
                        </Link>
                    </>
                    </div>
                </div>
                <div>
                    <img
                        className="object-cover w-full h-56 rounded shadow-lg sm:h-96"
                        src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=1260"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
};

export default About