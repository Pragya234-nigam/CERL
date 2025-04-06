'use client';
import React from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),//email 
  password: Yup.string().required('Password is Required')
    .matches(/[a-z]/, 'password must contain lowercase letter')
    .matches(/[A-Z]/, 'password must contain upper letter')
    .matches(/[0-9]/, 'password must contain Numeric digit')
    .matches(/\W/, 'password must contain Special character')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password must Match')
    .required('Password confirm is required')



});
//wrapper , trigger in react-toast

const SignUp = () => {

  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: (values) => {
      console.log(values);
      //send values to backend

      axios.post('http://localhost:5000/user/add', values)//Json direct//asynchronous no time to wait then catch error handling async
        .then((result) => {
          toast.success('User Registered Successfully');
          router.push('/login');
        }).catch((err) => {
          console.log(err);
          toast.error('User Registration Failed');
        });
    },
    validationSchema: SignupSchema
  })

  return (
    <div><main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <img src="https://tse2.mm.bing.net/th?id=OIP.M3ad2UaeqGbcO8i_gO6VUgHaD4&pid=Api&P=0&h=180" width={250} className="mx-auto" />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Create an account
            </h3>
            <p className="">
              Already have an account?
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
          <form onSubmit={signupForm.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="font-medium">Name</label>
              <input
                type="text"
                id="name"
                onChange={signupForm.handleChange}
                value={signupForm.values.name}
                required=""
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              {
                    (signupForm.errors.name && signupForm.touched.name) && (
                      <p className="text-xs text-red-600 mt-2" id="email-error">
                        {signupForm.errors.name}
                      </p>
                    )
                  }
            </div>
            <div>
              <label htmlFor="email" className="font-medium">Email</label>
              <input
                type="text"
                id="email"
                onChange={signupForm.handleChange}
                value={signupForm.values.email}
                required=""
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              {
                (signupForm.errors.email && signupForm.touched.email) && (
                  <p className="text-xs text-red-600 mt-2" id="email-error">
                    {signupForm.errors.email}
                  </p>
                )
              }
            </div>
            <div>
              <label htmlFor="password" className="font-medium">Password</label>
              <input
              type="password"
              id="password"
              onChange={signupForm.handleChange}
              value={signupForm.values.password}
                required=""
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              {
                    (signupForm.errors.password && signupForm.touched.password) && (
                      <p className="text-xs text-red-600 mt-2" id="email-error">
                        {signupForm.errors.password}
                      </p>
                    )
                  }
            </div>
            <div>
              <label htmlFor="confirmPassword" className="font-medium">Confirm Password</label>
              <input
              type="password"
              id="confirmPassword"
              onChange={signupForm.handleChange}
              value={signupForm.values.confirmPassword}
                required=""
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              {
                    (signupForm.errors.confirmPassword && signupForm.touched.confirmPassword) && (
                      <p className="text-xs text-red-600 mt-2" id="email-error">
                        {signupForm.errors.confirmPassword}
                      </p>
                    )
                  }
            </div>
            <button type="submit" className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
              Create account
            </button>
          </form>
        </div>
      </div>
    </main>
    </div>
  )
}

export default SignUp;