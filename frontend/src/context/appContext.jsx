'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load auth state on mount
    useEffect(() => {
        try {
            const userToken = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            const companyToken = typeof window !== 'undefined' ? localStorage.getItem('company') : null;
            
            if (userToken) {
                setUser(userToken);
            }
            if (companyToken) {
                setCompany(companyToken);
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
        } finally {
            setIsLoading(false);
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

    if (isLoading) {
        return null; // or a loading spinner
    }

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