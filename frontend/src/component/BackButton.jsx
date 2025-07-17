import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="sm:hidden inline-flex items-center gap-2 text-white px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm"
    >
      <FaArrowLeft className="text-base" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
