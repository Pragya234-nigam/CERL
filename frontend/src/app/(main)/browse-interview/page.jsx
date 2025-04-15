'use client';

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const BrowseInterview = () => {
    const [interviewData, setInterviewData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        skill: "",
        ageCategory: "",
        experience: "",
        education: "",
        jobType: ""
    });

    // Arrays for filter options
    const skills = ["JavaScript", "Python", "Java", "C++", "React", "Node.js", "Django", "Flask", "Ruby on Rails"];
    const ageCategories = ["below 20", "20-30", "30-40", "40-50", "above 50"];
    const experiences = ["fresher", "0-2 years", "3-5 years", "6+ years"];
    const educations = ["10th", "12th", "Graduate", "Post Graduate", "PhD"];
    const jobTypes = ["Internship", "Full-Time", "Part-Time", "Freelance"];

    const fetchInterview = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/interview/getall`);
        console.log(res.data);
        setInterviewData(res.data);
        setFilteredData(res.data);
    };

    useEffect(() => {
        fetchInterview();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    useEffect(() => {
        const filtered = interviewData.filter(item => {
            return (
                (!filters.skill || item.skills?.toLowerCase().includes(filters.skill.toLowerCase())) &&
                (!filters.ageCategory || item.ageCategory === filters.ageCategory) &&
                (!filters.experience || item.experience === filters.experience) &&
                (!filters.education || item.education === filters.education) &&
                (!filters.jobType || item.jobType === filters.jobType)
            );
        });
        setFilteredData(filtered); // Update the filteredData state
    }, [filters, interviewData]);

    return (
        <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
            <div className="text-center">
                <h1 className="text-3xl text-gray-800 font-semibold">
                    Browse Interviewers
                </h1>
                <p className="mt-3 text-gray-500">
                    Use the filters below to find interviewers that match your preferences.
                </p>
            </div>

            {/* Filters Section */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <select
                    name="skill"
                    value={filters.skill}
                    onChange={handleFilterChange}
                    className="border p-2 rounded shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="">Filter by skill</option>
                    {skills.map(skill => (
                        <option key={skill} value={skill.toLowerCase()}>{skill}</option>
                    ))}
                </select>
                <select
                    name="ageCategory"
                    value={filters.ageCategory}
                    onChange={handleFilterChange}
                    className="border p-2 rounded shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="">Filter by age category</option>
                    {ageCategories.map(age => (
                        <option key={age} value={age}>{age}</option>
                    ))}
                </select>
                <select
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                    className="border p-2 rounded shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="">Filter by experience</option>
                    {experiences.map(experience => (
                        <option key={experience} value={experience}>{experience}</option>
                    ))}
                </select>
                <select
                    name="education"
                    value={filters.education}
                    onChange={handleFilterChange}
                    className="border p-2 rounded shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="">Filter by education</option>
                    {educations.map(education => (
                        <option key={education} value={education.toLowerCase()}>{education}</option>
                    ))}
                </select>
                <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="border p-2 rounded shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="">Filter by job type</option>
                    {jobTypes.map(jobType => (
                        <option key={jobType} value={jobType.toLowerCase()}>{jobType}</option>
                    ))}
                </select>
            </div>

            {/* Interview Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item, key) => (
                    <article
                        className="shadow-lg border rounded-md p-4 hover:shadow-xl transition-shadow duration-300"
                        key={key}
                    >
                        <Link href={'/interview-detail/' + item._id}>
                            <div className="flex items-center space-x-4">
                                <img
                                    src={item.image || '/default-avatar.png'}
                                    alt="interview"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                                    <p className="text-sm text-gray-500">{item.jobType}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600">{item.description}</p>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default BrowseInterview;