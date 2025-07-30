import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackButton = ({ className = "", onClick = null }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg bg-transparent hover:bg-white/10 transition-all duration-200 text-sm font-medium backdrop-blur-sm  ${className}`}
    >
      <FaArrowLeft className="text-base" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;