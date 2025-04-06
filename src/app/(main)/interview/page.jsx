'use client';
import React from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';



const InterviewSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),//email 
    contactNo: Yup.string()
        .min(10, 'Contact Number must be 10 digits')
        .max(10, 'Contact Number must be 10 digits')
        .required('Contact Number is Required'),
    skills: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    age: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    experience: Yup.string()

        .required('Required'),
    education: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    address: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    resume: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
});
//wrapper , trigger in react-toast

const Interview = () => {

    const router = useRouter();

    const interviewForm = useFormik({
        initialValues: {
            name: '',
            email: '',
            contactNo: '',
            skills: '',
            age: '',
            experience: '',
            education: '',
            address: '',
            resume: '',
        },
        onSubmit: (values) => {
            console.log(values);
            //send values to backend

            axios.post('http://localhost:5000/interview/add', values)//Json direct//asynchronous no time to wait then catch error handling async
                .then((result) => {
                    toast.success('Interview Information Submitted Successfully');
                    router.push('/login');
                }).catch((err) => {
                    console.log(err);
                    toast.error('Interview Information Submitted Failed');
                });
        },
        validationSchema: InterviewSchema
    })

    return (
        <div><main className="w-full  flex flex-col items-center justify-center bg-gray-50 sm:px-4">
            <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
                <div className="text-center">
                    <img src="https://tse2.mm.bing.net/th?id=OIP.M3ad2UaeqGbcO8i_gO6VUgHaD4&pid=Api&P=0&h=180" width={250} className="mx-auto" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                            Fill the Form of Interview
                        </h3>
                    </div>
                </div>
                <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
                    <form onSubmit={interviewForm.handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.name}
                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {
                                (interviewForm.errors.name && interviewForm.touched.name) && (
                                    <p className="text-xs text-red-600 mt-2" id="email-error">
                                        {interviewForm.errors.name}
                                    </p>
                                )
                            }
                        </div>
                        <div>
                            <label htmlFor="email" className="font-medium">Email</label>
                            <input
                                type="text"
                                id="email"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.email}
                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {
                                (interviewForm.errors.email && interviewForm.touched.email) && (
                                    <p className="text-xs text-red-600 mt-2" id="email-error">
                                        {interviewForm.errors.email}
                                    </p>
                                )
                            }
                        </div>
                        <div>
                            <label htmlFor="contactNo" className="font-medium">Contact Number</label>
                            <input
                                type="text"
                                id="contactNo"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.contactNo}
                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {
                                (interviewForm.errors.contactNo && interviewForm.touched.contactNo) && (
                                    <p className="text-xs text-red-600 mt-2" id="email-error">
                                        {interviewForm.errors.contactNo}
                                    </p>
                                )
                            }
                        </div>
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="skills"
                                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                            >
                                Skills
                            </label><div className='flex gap-3'>
                                <textarea
                                    name="skills"
                                    id="skills"
                                    onChange={interviewForm.handleChange}
                                    value={interviewForm.values.activity}
                                    required=""
                                    className="h-28 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                                {
                                    (interviewForm.errors.skills && interviewForm.touched.skills) && (
                                        <p className="text-xs text-red-600 mt-2" id="email-error">
                                            {interviewForm.errors.skills}
                                        </p>
                                    )
                                }
                            </div></div>

                        <div>
                            <label htmlFor="age" className="font-medium">Age</label>
                            <input
                                type="text"
                                id="age"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.age}
                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {
                                (interviewForm.errors.age && interviewForm.touched.age) && (
                                    <p className="text-xs text-red-600 mt-2" id="email-error">
                                        {interviewForm.errors.age}
                                    </p>
                                )
                            }
                        </div>

                        <div>
                            <label htmlFor="experience" className="font-medium">Experience</label>
                            <input
                                type="text"
                                id="experience"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.experience}
                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {
                                (interviewForm.errors.experience && interviewForm.touched.experience) && (
                                    <p className="text-xs text-red-600 mt-2" id="email-error">
                                        {interviewForm.errors.experience}
                                    </p>
                                )
                            }
                        </div>
                        <div>
                            <label htmlFor="education" className="font-medium">Education</label>
                            <input
                                type="text"
                                id="education"
                                onChange={interviewForm.handleChange}
                                value={interviewForm.values.education}
                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                            {
                                (interviewForm.errors.education && interviewForm.touched.education) && (
                                    <p className="text-xs text-red-600 mt-2" id="email-error">
                                        {interviewForm.errors.education}
                                    </p>
                                )
                            }
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="address"
                                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                            >
                                Address
                            </label><div className='flex gap-3'>
                                <textarea
                                    name="address"
                                    id="address"
                                    onChange={interviewForm.handleChange}
                                    value={interviewForm.values.address}
                                    required=""
                                    className="h-28 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                                {
                                    (interviewForm.errors.address && interviewForm.touched.address) && (
                                        <p className="text-xs text-red-600 mt-2" id="email-error">
                                            {interviewForm.errors.address}
                                        </p>
                                    )
                                }
                            </div></div>
                            


                        <div>
                            <label className="file-upload-label">Resume<br></br>
                                <input
                                    type="file"
                                    accept=".pdf, .doc, .docx, .txt, .rtf"
                                    onChange={interviewForm.handleChange}
                                    value={interviewForm.values.resume}
                                    id="resume"
                                    required=""
                                    className="file-input"
                                />
                            
                            </label>
                            {
                                (interviewForm.errors.resume && interviewForm.touched.resume) && (
                                    <p className="text-xs text-red-600 mt-2" id="email-error">
                                        {interviewForm.errors.resume}
                                    </p>
                                )
                            }
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </main>
        </div>
    )
}

export default Interview;