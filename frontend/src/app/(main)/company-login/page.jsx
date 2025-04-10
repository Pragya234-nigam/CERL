'use client';
import React from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
const LoginSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),

});
const Login = () => {
    const loginForm = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (values) => {
            console.log(values);
        },
        validationSchema: LoginSchema
    })
    return (
        <div>
            <main className="w-full h-screen flex flex-col items-center justify-center px-4">
                <div className="max-w-sm w-full text-gray-600 space-y-5">
                    <div className="text-center pb-8">
                        <img src="https://tse2.mm.bing.net/th?id=OIP.M3ad2UaeqGbcO8i_gO6VUgHaD4&pid=Api&P=0&h=180" height={20} width={250} className="mx-auto" />
                        <div className="mt-5">
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                                Log in to your Company account
                            </h3>
                        </div>
                    </div>
                    <form onSubmit={loginForm.handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="font-medium"> Email </label>
                            <input
                                type="email"
                                id="email"
                                onChange={loginForm.handleChange}
                                value={loginForm.values.email}

                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"
                                className="font-medium"> Password </label>
                            <input
                                type="password"
                                id="password"
                                onChange={loginForm.handleChange}
                                value={loginForm.values.password}
                                required=""
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
                            Sign in
                        </button>
                    </form>
                    <p className="text-center">
                        Don't have an account?
                        <a
                            href="/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
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