import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomSelect = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 pl-4 pr-10 text-sm md:text-base text-white font-semibold 
                   bg-gradient-to-r from-[#4b3d75] to-[#5a4da0] rounded-2xl shadow-lg 
                   border border-purple-500/30 hover:border-purple-400/50 
                   focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        {selected ? selected.label : "Choose Time"}
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-200" />
      </button>

      {isOpen && (
        <ul
          className="absolute left-0 mt-2 w-full max-h-60 overflow-y-auto 
                     bg-[#2e2a4d] rounded-2xl shadow-xl border border-purple-400/20 
                     text-sm md:text-base text-white z-50"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-2 cursor-pointer transition 
                          hover:bg-purple-600/40 ${selected?.value === opt.value ? "bg-purple-700" : ""}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
