import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

function BackButton() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className='text-white bg-[#9810FA] hover:bg-[#9810fa9d] px-3 py-2 flex items-center gap-1 rounded-xl cursor-pointer'>
            <IoMdArrowRoundBack className="text-xl flex-shrink-0" />
            <p className='font-semibold text-lg'>
                Back
            </p>
        </button>
    );
}

export default BackButton;