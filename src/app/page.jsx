'use client';
import { useState, useEffect } from "react";

export default () => {

    const [state, setState] = useState(false)

    // Replace javascript:void(0) paths with your paths
    const navigation = [
        { title: "Features", path: "javascript:void(0)" },
        { title: "Integrations", path: "javascript:void(0)" },
        { title: "Customers", path: "javascript:void(0)" },
        { title: "Pricing", path: "javascript:void(0)" }
    ]

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };
    }, [])


    const Brand = () => (
        <div className="flex items-center justify-between py-5 md:block">
            <a href="javascript:void(0)">
                <img
                    src="https://in.images.search.yahoo.com/images/view;_ylt=AwrKEZdEdd5nbIcz3Fm9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkA2E3MmJmMmJmNjBhYzMzZjhmMjUxMGYyM2U2ZDY3NjY3BGdwb3MDMjcEaXQDYmluZw--?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3DHireQuest%2BLogo%26ei%3DUTF-8%26type%3DE210IN826G0%26fr%3Dmcafee%26fr2%3Dp%253As%252Cv%253Ai%252Cm%253Asb-top%26tab%3Dorganic%26ri%3D27&w=480&h=380&imgurl=hirequest.com%2Fwp-content%2Fuploads%2F2021%2F12%2FCorporateSite_HQLLC.png&rurl=https%3A%2F%2Fhirequest.com%2Fcorporate-history%2F&size=10KB&p=HireQuest+Logo&oid=a72bf2bf60ac33f8f2510f23e6d67667&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&fr=mcafee&tt=Corporate+History+-+HireQuest+Inc.+%7C+Staffing+%26+Recruiting+Services+...&b=0&ni=160&no=27&ts=&tab=organic&sigr=jtYokCJBWGdx&sigb=f587WyMcmvHn&sigi=PzPY7qP35NCI&sigt=dRDDGDCpHFHY&.crumb=NSmhPLDbgeG&fr=mcafee&fr2=p%3As%2Cv%3Ai%2Cm%3Asb-top&type=E210IN826G0"
                    width={120}
                    height={50}
                    alt="Float UI logo"
                />
            </a>
            <div className="md:hidden">
                <button className="menu-btn text-gray-400 hover:text-gray-300"
                    onClick={() => setState(!state)}
                >
                    {
                        state ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )
                    }
                </button>
            </div>
        </div>
    )

    return (
        <div className="bg-gray-900">
            <header>
                <div className={`md:hidden ${state ? "mx-2 pb-5" : "hidden"}`}>
                    <Brand />
                </div>
                
            </header>
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
                        <a href="/signup" className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                            Get Started
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }}></div>
            </section>
        </div>
    )
}