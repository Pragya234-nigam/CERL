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
      phone:'',
      location:'',
      eduaction:'',
      skills:'',
      experience:'',
      bio:'',
      password: '',
      confirmPassword: ''
    },
    onSubmit: (values) => {
      console.log(values);
      //send values to backend

      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, values)//Json direct//asynchronous no time to wait then catch error handling async
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.M3ad2UaeqGbcO8i_gO6VUgHaD4&pid=Api&P=0&h=180"
            width={250}
            className="mx-auto mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
          <div className="space-y-3">
            <h3 className="text-gray-900 text-3xl font-extrabold">
              Create an account
            </h3>
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Log in
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8 space-y-6 border border-gray-100">
          <form onSubmit={signupForm.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                onChange={signupForm.handleChange}
                value={signupForm.values.name}
                required=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 text-base"
              />
              {(signupForm.errors.name && signupForm.touched.name) && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {signupForm.errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                onChange={signupForm.handleChange}
                value={signupForm.values.email}
                required=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 text-base"
              />
              {(signupForm.errors.email && signupForm.touched.email) && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {signupForm.errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                onChange={signupForm.handleChange}
                value={signupForm.values.password}
                required=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 text-base"
              />
              {(signupForm.errors.password && signupForm.touched.password) && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {signupForm.errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                onChange={signupForm.handleChange}
                value={signupForm.values.confirmPassword}
                required=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 text-base"
              />
              {(signupForm.errors.confirmPassword && signupForm.touched.confirmPassword) && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {signupForm.errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="education" className="font-medium">Education</label>
              <select
                id="education"
                onChange={signupForm.handleChange}
                value={signupForm.values.education}
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
              {signupForm.errors.education && signupForm.touched.education && (
                <p className="text-xs text-red-600 mt-2">{signupForm.errors.education}</p>
              )}
            </div>

            <div>
              <label htmlFor="skills" className="font-medium">Skills</label>
              <textarea
                id="skills"
                onChange={signupForm.handleChange}
                value={signupForm.values.skills}
                required
                className="w-full mt-2 h-32 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              {signupForm.errors.skills && signupForm.touched.skills && (
                <p className="text-xs text-red-600 mt-2">{signupForm.errors.skills}</p>
              )}
            </div>

            <div>
              <label htmlFor="experience" className="font-medium">Experience</label>
              <select
                id="experience"
                onChange={signupForm.handleChange}
                value={signupForm.values.experience}
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher</option>
                <option value="0-2 years">0-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6+ years">6+ years</option>
              </select>
              {signupForm.errors.experience && signupForm.touched.experience && (
                <p className="text-xs text-red-600 mt-2">{signupForm.errors.experience}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                id="bio"
                onChange={signupForm.handleChange}
                value={signupForm.values.bio}
                required=""
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 text-base resize-none"
              />
              {(signupForm.errors.bio && signupForm.touched.bio) && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {signupForm.errors.bio}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                id="phone"
                onChange={signupForm.handleChange}
                value={signupForm.values.phone}
                required=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 text-base"
              />
              {(signupForm.errors.phone && signupForm.touched.phone) && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {signupForm.errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                id="location"
                onChange={signupForm.handleChange}
                value={signupForm.values.location}
                required=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 text-base"
              />
              {(signupForm.errors.location && signupForm.touched.location) && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {signupForm.errors.location}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-white text-lg font-semibold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Create account
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default SignUp;