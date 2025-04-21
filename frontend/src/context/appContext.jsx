'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const router = useRouter();

    

    // Load auth state on mount
    useEffect(() => {
        const userToken = localStorage.getItem('user');
        const companyToken = localStorage.getItem('company');
        
        if (userToken) {
            setUser(userToken);
        }
        if (companyToken) {
            setCompany(companyToken);
        }
    }, []);

    // Logout function for company
    const companyLogout = () => {
        localStorage.removeItem('company');
        setCompany(null);
        router.push('/about');
    };

    // Logout function for employee
    const employeeLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/about');
    };

    return (
        <AppContext.Provider value={{ 
            user, 
            setUser, 
            company, 
            setCompany, 
            companyLogout, 
            employeeLogout 
        }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};