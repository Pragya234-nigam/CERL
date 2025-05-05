'use client';
import React from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/appContext';
const ISSERVER = typeof window === 'undefined';

const LoginSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is required'),
    email: Yup.string().email('Invalid email').required('Required'),
});

const Login = () => {
    const router = useRouter();
    const { setCompany } = useAppContext();

    const loginForm = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (values) => {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/company/authenticate`, values)
                .then((result) => {
                    !ISSERVER && localStorage.setItem('company', result.data.token);
                    setCompany(result.data); // Store full company data in context
                    toast.success("Login Successful");
                    router.push("/about-company")
                }).catch((err) => {
                    toast.error("Invalid Credentials");
                    console.log(err);
                });
        },
        validationSchema: LoginSchema
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <main className="w-full min-h-screen flex flex-col items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="text-center pb-8">
                        <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
                            <img 
                                src="https://tse2.mm.bing.net/th?id=OIP.M3ad2UaeqGbcO8i_gO6VUgHaD4&pid=Api&P=0&h=180" 
                                height={20} 
                                width={250} 
                                className="mx-auto rounded-lg shadow-md" 
                                alt="Logo"
                            />
                        </div>
                        <div className="mt-5 space-y-2">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Welcome Back!
                            </h3>
                            <p className="text-gray-500">Log into your company account</p>
                        </div>
                    </div>
                    <form onSubmit={loginForm.handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    onChange={loginForm.handleChange}
                                    value={loginForm.values.email}
                                    required
                                    className="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg outline-none border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                                {loginForm.errors.email && loginForm.touched.email && (
                                    <p className="text-red-500 text-sm mt-1">{loginForm.errors.email}</p>
                                )}
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={loginForm.handleChange}
                                    value={loginForm.values.password}
                                    required
                                    className="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg outline-none border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    placeholder="Enter your password"
                                />
                                {loginForm.errors.password && loginForm.touched.password && (
                                    <p className="text-red-500 text-sm mt-1">{loginForm.errors.password}</p>
                                )}
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 rounded-lg transform hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Sign in
                        </button>
                    </form>
                    <p className="text-center mt-6 text-gray-600">
                        Don't have an account?{' '}
                        <a
                            href="/company-signup"
                            className="font-medium text-blue-600 hover:text-indigo-600 transition-colors duration-200 underline-offset-2 hover:underline"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Login;