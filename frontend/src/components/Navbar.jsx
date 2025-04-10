'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const MenuBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [isInterviewMenuOpen, setIsInterviewMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleEmployeeMenu = () => {
    setIsEmployeeMenuOpen(!isEmployeeMenuOpen);
  };

  const toggleCompanyMenu = () => {
    setIsCompanyMenuOpen(!isCompanyMenuOpen);
  };

  const toggleInterviewMenu = () => {
    setIsInterviewMenuOpen(!isInterviewMenuOpen);
  };

  return (
    <div>
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
        <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          {/* Brand */}
          <a href="/about"
            className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white cursor-pointer"
            aria-label="Brand"
            
          >
            HireQuest
          </a>

          {/* Main Menu */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden dark:text-neutral-400 dark:hover:text-neutral-500 cursor-pointer"
            >
              Menu
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                {/* Employees */}
                <div className="relative">
                  <button
                    onClick={toggleEmployeeMenu}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                  >
                    Employees
                  </button>
                  {isEmployeeMenuOpen && (
                    <div className="absolute right-full top-0 mt-0 w-48 bg-white border rounded-md shadow-lg z-10">
                      <Link href="/signup" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">

                        Signup

                      </Link>
                      <Link href="/login" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">

                        Login

                      </Link>
                      <Link href="/interview" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">

                        Interview form

                      </Link>
                      <Link href="/interview-details" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">

                        Interview Details

                      </Link>
                      <a
                        href="/logout"
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Log Out
                      </a>
                    </div>
                  )}
                </div>

                {/* Company */}
                <div className="relative">
                  <button
                    onClick={toggleCompanyMenu}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                  >
                    Company
                  </button>
                  {isCompanyMenuOpen && (
                    <div className="absolute right-full top-0 mt-0 w-48 bg-white border rounded-md shadow-lg z-10">
                      <Link href="/company-signup" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">

                        Signup

                      </Link>
                      <Link href="/company-login" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                        Login
                      </Link>

                      <Link href="/interview-details" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">

                        Interview Details

                      </Link>
                      <a
                        href="/logout"
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Log Out
                      </a>
                    </div>
                  )}
                </div>

          
                

                {/* About */}
                <Link href="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">

                  About

                </Link>



              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default MenuBar;