'use client';
import React, { useEffect } from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const InterviewSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    contactNo: Yup.string()
        .min(10, 'Contact Number must be 10 digits')
        .max(10, 'Contact Number must be 10 digits')
        .required('Contact Number is Required'),
    codeLink: Yup.string().url('Must be a valid URL').required('Code test link is required'),
    meetingLink: Yup.string().url('Must be a valid URL').required('Meeting link is required')
});

const Interview = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const updateId = searchParams.get('update');
    const token = localStorage.getItem('company');

    const interviewForm = useFormik({
        initialValues: {
            image: '',
            name: '',
            email: '',
            contactNo: '',
            skills: '',
            age: '',
            experience: '',
            education: '',
            address: '',
            jobType: '',
            interviewDate: '',
            interviewTime: '',
            meetingLink: '',
            codeLink: '',
        },
        onSubmit: async (values) => {
            try {
                if (updateId) {
                    // Update existing interview
                    const response = await axios.put(
                        `${process.env.NEXT_PUBLIC_API_URL}/interview/update/${updateId}`,
                        values,
                        {
                            headers: {
                                'x-auth-token': token
                            }
                        }
                    );
                    if (response.status === 200) {
                        toast.success('Interview Updated Successfully');
                        localStorage.removeItem('updateInterview'); // Clean up
                        router.push('/company/manage-interview');
                    }
                } else {
                    // Create new interview
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/interview/add`,
                        values,
                        {
                            headers: {
                                'x-auth-token': token
                            }
                        }
                    );
                    if (response.status === 200) {
                        toast.success('Interview Created Successfully');
                        router.push('/browse-interview');
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error(updateId ? 'Failed to update interview' : 'Failed to create interview');
            }
        },
        validationSchema: InterviewSchema
    });

    useEffect(() => {
        if (updateId) {
            // Load interview data from localStorage if this is an update
            const savedData = localStorage.getItem('updateInterview');
            if (savedData) {
                const interviewData = JSON.parse(savedData);
                Object.keys(interviewForm.initialValues).forEach(key => {
                    if (interviewData[key]) {
                        interviewForm.setFieldValue(key, interviewData[key]);
                    }
                });
            }
        }
    }, [updateId]);

    const upload = (e) => {
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'interview');
        fd.append('cloud_name', 'dcvorslf4')

        axios.post('https://api.cloudinary.com/v1_1/dcvorslf4/upload', fd)
            .then((res) => {
                toast.success('File Uploaded Successfully');
                console.log(res.data);
                interviewForm.setFieldValue('image', res.data.secure_url);
            }).catch((err) => {
                console.log(err);
                toast.error('File Upload Failed');
            });
    }

    return (
        <div><main className="w-full flex flex-col items-center justify-center bg-gray-50 sm:px-4">
            <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
                <div className="text-center">
                    <img src="https://tse2.mm.bing.net/th?id=OIP.M3ad2UaeqGbcO8i_gO6VUgHaD4&pid=Api&P=0&h=180" width={250} className="mx-auto" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                            {updateId ? 'Update Interview' : 'Create New Interview'}
                        </h3>
                    </div>
                </div>
                <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
                    <form onSubmit={interviewForm.handleSubmit} className="space-y-5">
                        <div className="max-w-sm">
                            <label htmlFor='upload' className="block file-upload-label font-medium">
                                Upload Profile Photo<br /><br />
                                <input id="upload" type="file" onChange={upload} hidden />
                                <span className="sr-only">Choose profile photo</span>
                                <input
                                    type="text"
                                    className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400"
                                    id="image"
                                    onChange={interviewForm.handleChange}
                                    value={interviewForm.values.image}
                                />
                            </label>
                            {interviewForm.errors.image && interviewForm.touched.image && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.image}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="name" className="font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.name}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.name && interviewForm.touched.name && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.email}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.email && interviewForm.touched.email && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contactNo" className="font-medium">Contact Number</label>
                            <input
                                type="text"
                                id="contactNo"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.contactNo}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.contactNo && interviewForm.touched.contactNo && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.contactNo}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="skills" className="font-medium">Skills Required</label>
                            <textarea
                                id="skills"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.skills}
                                required
                                className="w-full mt-2 h-32 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.skills && interviewForm.touched.skills && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.skills}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="age" className="font-medium">Age</label>
                            <select
                                id="age"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.age}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            >
                                <option value="">Select Age Range</option>
                                <option value="below 20">Below 20</option>
                                <option value="20-30">20-30</option>
                                <option value="30-40">30-40</option>
                                <option value="40-50">40-50</option>
                                <option value="above 50">Above 50</option>
                            </select>
                            {interviewForm.errors.age && interviewForm.touched.age && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.age}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="experience" className="font-medium">Experience</label>
                            <select
                                id="experience"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.experience}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            >
                                <option value="">Select Experience</option>
                                <option value="fresher">Fresher</option>
                                <option value="0-2 years">0-2 years</option>
                                <option value="3-5 years">3-5 years</option>
                                <option value="6+ years">6+ years</option>
                            </select>
                            {interviewForm.errors.experience && interviewForm.touched.experience && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.experience}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="education" className="font-medium">Education</label>
                            <select
                                id="education"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.education}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            >
                                <option value="">Select Education</option>
                                <option value="10th">10th</option>
                                <option value="12th">12th</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Post Graduate">Post Graduate</option>
                                <option value="PhD">PhD</option>
                            </select>
                            {interviewForm.errors.education && interviewForm.touched.education && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.education}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="address" className="font-medium">Address</label>
                            <textarea
                                id="address"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.address}
                                required
                                className="w-full mt-2 h-32 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.address && interviewForm.touched.address && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.address}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="jobType" className="font-medium">Job Type</label>
                            <select
                                id="jobType"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.jobType}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            >
                                <option value="">Select Job Type</option>
                                <option value="Internship">Internship</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            {interviewForm.errors.jobType && interviewForm.touched.jobType && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.jobType}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="interviewDate" className="font-medium">Interview Date</label>
                            <input
                                type="date"
                                id="interviewDate"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.interviewDate}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.interviewDate && interviewForm.touched.interviewDate && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.interviewDate}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="interviewTime" className="font-medium">Interview Time</label>
                            <input
                                type="time"
                                id="interviewTime"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.interviewTime}
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.interviewTime && interviewForm.touched.interviewTime && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.interviewTime}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="meetingLink" className="font-medium">Meeting Link</label>
                            <input
                                type="url"
                                id="meetingLink"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.meetingLink}
                                required
                                placeholder="https://example.com/meeting"
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.meetingLink && interviewForm.touched.meetingLink && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.meetingLink}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="codeLink" className="font-medium">Code Test Link</label>
                            <input
                                type="url"
                                id="codeLink"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.codeLink}
                                required
                                placeholder="https://example.com/code-test"
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {interviewForm.errors.codeLink && interviewForm.touched.codeLink && (
                                <p className="text-xs text-red-600 mt-2">{interviewForm.errors.codeLink}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                        >
                            {updateId ? 'Update Interview' : 'Create Interview'}
                        </button>
                    </form>
                </div>
            </div>
        </main></div>
    )
}

export default Interview;