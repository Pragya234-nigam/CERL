'use client';
import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/appContext";

const Navbar = () => {
    const { companyLogout, employeeLogout, company, user, showNavbar } = useAppContext();
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const companyDropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);

    const toggleCompanyDropdown = () => {
        setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
        setIsEmployeeDropdownOpen(false);
    };

    const toggleEmployeeDropdown = () => {
        setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen);
        setIsCompanyDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target) &&
            employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
            setIsCompanyDropdownOpen(false);
            setIsEmployeeDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // if (!showNavbar) return null;

    return (
        <div className="top-0 left-0 right-0 z-50">
            <header>
                <nav className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-10">
                            <div className="flex items-center">
                                <a href="/about" className="text-2xl font-bold text-gray-800">
                                    HireQuest
                                </a>

                                <div className="ml-10 flex items-center space-x-4">
                                    {/* Only show company dropdown when no user is logged in */}
                                    {!user && (
                                        <div className="relative" ref={companyDropdownRef}>
                                            <button
                                                onClick={toggleCompanyDropdown}
                                                className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                                            >
                                                Company
                                            </button>
                                            {isCompanyDropdownOpen && (
                                                <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                                                    {!company ? (
                                                        <>
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
                                                        </>
                                                    ) : (
                                                        <>
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
                                                                Browse Interviews
                                                            </a>
                                                            <a
                                                                href="/company/manage-interview"
                                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Manage Interview
                                                            </a>
                                                            <a
                                                                href="/company/list-interview"
                                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                List Interview
                                                            </a>
                                                            <button
                                                                onClick={companyLogout}
                                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Logout
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Only show employee dropdown when no company is logged in */}
                                    {!company && (
                                        <div className="relative" ref={employeeDropdownRef}>
                                            <button
                                                onClick={toggleEmployeeDropdown}
                                                className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                                            >
                                                Employee
                                            </button>
                                            {isEmployeeDropdownOpen && (
                                                <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                                                    {!user ? (
                                                        <>
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
                                                        </>
                                                    ) : (
                                                        <>
                                                            <a
                                                                href="/browse-interview"
                                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Browse Interviews
                                                            </a>
                                                            <a
                                                                href="/user/profile"
                                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                My Profile
                                                            </a>
                                                            <a
                                                                href="/user/applied-interviews"
                                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Applied Interviews
                                                            </a>
                                                            <button
                                                                onClick={employeeLogout}
                                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Logout
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
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