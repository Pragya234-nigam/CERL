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
    const experiences = ["fresher","0-2 years", "3-5 years", "6+ years"];
    const educations = ["10th", "12th", "Graduate", "Post Graduate"," PhD"];
    const jobTypes = ["Internship","Full-Time", "Part-Time", "Freelance"];

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
        setFilteredData(filtered);
    }, [filters, interviewData]);

    return (
        <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
            <div className="text-center">
                <h1 className="text-3xl text-gray-800 font-semibold">
                    List of Interviewers
                </h1>
                <p className="mt-3 text-gray-500">
                    Interviewers are listed below. You can click on the interview to view more details about it.
                </p>
            </div>

            {/* Filters Section */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <select
                    name="skill"
                    value={filters.skill}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
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
                    className="border p-2 rounded"
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
                    className="border p-2 rounded"
                >
                    <option value="">Filter by experience</option>
                    {experiences.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                    ))}
                </select>
                <select
                    name="education"
                    value={filters.education}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                >
                    <option value="">Filter by education</option>
                    {educations.map(edu => (
                        <option key={edu} value={edu.toLowerCase()}>{edu}</option>
                    ))}
                </select>
                <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                >
                    <option value="">Filter by job type</option>
                    {jobTypes.map(job => (
                        <option key={job} value={job.toLowerCase()}>{job}</option>
                    ))}
                </select>
            </div>

            <div className="mt-12">
                {
                    filteredData.map((item, key) => (
                        <article className="max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm" key={key}>
                            <Link href={'/interview-detail/' + item._id}>
                                <div className="flex item-center mt-2 pt-3 ml-4 mr-2">
                                    <div className="flex-none h-16">
                                        <img src={item.image} alt="interview" className="w-16 h-16 rounded-full object-cover" />
                                        <span className="block text-gray-900">{item.name}</span>
                                        <span className="block text-gray-400 text-sm">{item.jobType}</span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))
                }
            </div>
        </section>
    );
};

export default BrowseInterview;