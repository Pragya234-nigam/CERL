'use client';
import React from 'react'

const Navbar = () => {
  return (
    <div><header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <h1
          className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white"
          aria-label="Brand"
        >
          HireQuest
        </h1>
        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
          <a
            className="font-medium text-blue-500 focus:outline-hidden"
            href="/signup"
            aria-current="page"
          >
            Employers Sign Up
          </a>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            href="/login"
          >
            Employers Login
          </a>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            href="/about"
          >
            About
          </a>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            href="/company-login"
          >
            Company Login
          </a>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            href="/company-signup"
          >
            Company Sign Up
          </a>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            href="/interview"
          >
            Interview
          </a>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            href="/browse-interview"
          >
            Interview Details
          </a>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            href=""
          >
            Log Out
          </a>
        </div>
      </nav>
    </header>
    </div>
  )
}

export default Navbar