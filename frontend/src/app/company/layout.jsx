'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

const Layout = ({ children }) => {

    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('company');
      if (!token) {
        toast.error("Please login to access this page");
        router.push("/company-login");
      }
    }, [])
    

    return (
        <div>{children}</div>
    )
}

export default Layout;