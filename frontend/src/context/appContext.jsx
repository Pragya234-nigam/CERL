'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showNavbar, setShowNavbar] = useState(false);
    const router = useRouter();

    // Load auth state on mount
    useEffect(() => {
        try {
            const userToken = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            const companyToken = typeof window !== 'undefined' ? localStorage.getItem('company') : null;
            const navbarState = typeof window !== 'undefined' ? localStorage.getItem('showNavbar') : null;
            
            if (userToken) {
                setUser(userToken);
            }
            if (companyToken) {
                setCompany(companyToken);
            }
            if (navbarState) {
                setShowNavbar(true);
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleShowNavbar = () => {
        setShowNavbar(true);
        localStorage.setItem('showNavbar', 'true');
    };

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
        return null;
    }

    return (
        <AppContext.Provider value={{ 
            user, 
            setUser, 
            company, 
            setCompany, 
            companyLogout, 
            employeeLogout,
            showNavbar,
            handleShowNavbar
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);