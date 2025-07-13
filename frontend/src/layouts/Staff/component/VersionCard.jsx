import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedVersion } from "../../../redux/features/sellingSlice";

const VersionCard = ({ version, selectedVersion, children, readonly = false, className = "", }) => {
    const dispatch = useDispatch();

    const getGradient = (ver) => {
        switch (ver) {
            case "IMAX":
                return "bg-gradient-to-r from-[#004897] to-[#0AF7FB] text-white";
            case "4DX":
                return "bg-gradient-to-r from-[#680000] to-[#F26969] text-white";
            case "3D":
                return "bg-gradient-to-r from-[#C88200] to-[#FFE606] text-white";
            case "2D":
                return "bg-gradient-to-r from-[#147800] to-[#5EFF41] text-white";
            default:
                return "bg-gradient-to-tr from-[#f7bbd3] via-[#c7a6f2] via-[#97ccf1] to-[#ffcfbe] text-white";
        }
    };

    const isSelected = selectedVersion === version;

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`font-bold px-5 py-1.5 rounded-lg cursor-pointer transition-all duration-300
                            ${!readonly ? "cursor-pointer" : ""}
                            ${!readonly && isSelected ? "scale-107 shadow-lg shadow-gray-400" : ""}
                            ${getGradient(version)}
                            ${className}`}
                title={version}
                onClick={() => {
                    if (!readonly) dispatch(setSelectedVersion(version));
                }}
            >
                {version}

                <div>
                    {!readonly && children}
                </div>
            </div>
        </div>
    );
};

export default VersionCard;
