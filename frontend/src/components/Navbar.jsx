"use client";

import React, { useState } from 'react';

const Navbar = () => {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  const toggleCompanyDropdown = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
    setIsEmployeeDropdownOpen(false); // Close Employee dropdown when Company is toggled
  };

  const toggleEmployeeDropdown = () => {
    setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen);
    setIsCompanyDropdownOpen(false); // Close Company dropdown when Employee is toggled
  };

  return (
    <div>
      <header>
        <nav className="bg-white shadow">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <a href="/about" className="text-2xl font-bold text-gray-800">HireQuest</a>
            <div className="flex items-center space-x-4">
              {/* Company Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleCompanyDropdown}
                  className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-500 cursor-pointer"
                >
                  Company
                </button>
                {isCompanyDropdownOpen && (
                  <div className="absolute mt-2 bg-white border rounded shadow-lg">
                    <a
                      href="/company-login"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Login
                    </a>
                    <a
                      href="/company-signup"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Signup
                    </a>
                    <a
                      href="/browse-interview"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Interviewers
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>

              {/* Employee Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleEmployeeDropdown}
                  className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-500 cursor-pointer"
                >
                  Employee
                </button>
                {isEmployeeDropdownOpen && (
                  <div className="absolute mt-2 bg-white border rounded shadow-lg">
                    <a
                      href="/login"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Signup
                    </a>
                    <a
                      href="/browse-interview"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Interviewers
                    </a>
                    <a
                      href="/interview"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Interview Form
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>

              {/* About Page Link */}
              <a
                href="/about"
                className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-500"
              >
                About
              </a>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;