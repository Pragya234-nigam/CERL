'use client';
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";

export default () => {
    const [state, setState] = useState(false);
    const { handleShowNavbar } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };
    }, []);

    const handleGetStarted = () => {
        handleShowNavbar();
        router.push('/about');
    };

    return (
        <div className="bg-gray-900">
            <section className="relative">
                <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
                    <div className="space-y-5 max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl text-white font-extrabold mx-auto md:text-5xl">
                            Welcome to HireQuest
                        </h2>
                        <h2 className="text-1xl text-white mx-auto md:text-5xl">
                            Connecting talent with opportunity, effortlessly
                        </h2>
                        <p className="max-w-2xl mx-auto text-gray-400">
                            Empower your job to grow and succeed with the best tools for recruitment, talent management, and seamless user experiences.
                        </p>
                        <button 
                            onClick={handleGetStarted}
                            className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
                        >
                            Get Started
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }}></div>
            </section>
        </div>
    );
};