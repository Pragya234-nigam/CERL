'use client';
import React, { createContext, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State for employee
    const [company, setCompany] = useState(null); // State for company
    const router = useRouter();

    // Logout function for both employee and company
    const logout = () => {
        localStorage.removeItem('user'); // Remove employee token
        localStorage.removeItem('company'); // Remove company token
        setUser(null);
        setCompany(null);
        router.push('/login'); // Redirect to login page
    };

    return (
        <AppContext.Provider value={{ user, setUser, company, setCompany, logout }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};