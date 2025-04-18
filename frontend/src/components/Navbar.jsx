"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/appContext";

const Navbar = () => {
  const { logout } = useAppContext();
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  const companyDropdownRef = useRef(null);
  const employeeDropdownRef = useRef(null);

  const toggleCompanyDropdown = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
    setIsEmployeeDropdownOpen(false); // Close Employee dropdown when Company is toggled
  };

  const toggleEmployeeDropdown = () => {
    setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen);
    setIsCompanyDropdownOpen(false); // Close Company dropdown when Employee is toggled
  };

  const handleClickOutside = (event) => {
    if (
      companyDropdownRef.current &&
      !companyDropdownRef.current.contains(event.target) &&
      employeeDropdownRef.current &&
      !employeeDropdownRef.current.contains(event.target)
    ) {
      setIsCompanyDropdownOpen(false);
      setIsEmployeeDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <a href="/about" className="text-2xl font-bold text-gray-800">HireQuest</a>
                <div className="relative ml-4" ref={companyDropdownRef}>
                  <button
                    onClick={toggleCompanyDropdown}
                    className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Company
                  </button>
                  {isCompanyDropdownOpen && (
                    <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md">
                      <a
                        href="/company-login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </a>
                      <a
                        href="/company-signup"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Signup
                      </a>
                      <a
                        href="/company/add-interview"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Interview Form
                      </a>
                      <a
                        href="/browse-interview"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Interviewers
                      </a>
                      <a
                        href="/company/manage-interview"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Manage Interview
                      </a>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative ml-4" ref={employeeDropdownRef}>
                  <button
                    onClick={toggleEmployeeDropdown}
                    className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Employee
                  </button>
                  {isEmployeeDropdownOpen && (
                    <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md">
                      <a
                        href="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </a>
                      <a
                        href="/signup"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Signup
                      </a>
                      <a
                        href="/company/add-interview"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Interview Form
                      </a>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                
                <a
                  href="/about"
                  className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  About
                </a>
              </div>
              </div>
                
             
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;