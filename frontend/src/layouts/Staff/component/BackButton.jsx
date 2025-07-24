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
            // className="group text-[#9810FA] px-3 py-2 rounded-full  transition-all flex items-center gap-1 cursor-pointer
            //  w-11 hover:w-auto hover:rounded-full overflow-hidden"
            className='text-white bg-[#9810FA] px-3 py-2 flex items-center gap-1 rounded-full cursor-pointer'
            // style={{ whiteSpace: 'nowrap' }}
        >
            <IoMdArrowRoundBack className="text-xl flex-shrink-0" />
            <span
             //   className="text-lg opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 font-semibold"
            >
                Back
            </span>
        </button>
    );
}

export default BackButton;
