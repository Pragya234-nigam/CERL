'use client';
import { useParams } from 'next/navigation';
import React from 'react'

const InterviewDetail = () => {

    const { id } = useParams();

    return (
        <div>InterviewDetail</div>
    )
}

export default InterviewDetail;