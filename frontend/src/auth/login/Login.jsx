import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Film, Star } from "lucide-react";
import logoWeb from "../../assets/logoWeb.png";
import imageLogin1 from "../../assets/imageLogin1.jpg";
import imageLogin2 from "../../assets/imageLogin2.jpg";
import imageLogin3 from "../../assets/imageLogin3.jpg";
import imageLogin4 from "../../assets/imageLogin4.jpg";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/API";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

const MovieTheaterLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [focusedField, setFocusedField] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Movie backgrounds - poster phim
  const movieBackgrounds = [imageLogin1, imageLogin2, imageLogin3, imageLogin4];

  // Auto change background every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(
        (prevIndex) => (prevIndex + 1) % movieBackgrounds.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [movieBackgrounds.length]);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    setIsLoading(true);
    try {
      console.log("Form data gửi:", formData);
      const response = await api.post("login", formData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Successfully logged in!");
      dispatch(login(response.data.user));
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" relative overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {movieBackgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 object-cover bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentBgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${bg})`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-900/40" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-4000"></div>

        {/* Floating movie icons */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Film className="text-yellow-400 w-6 h-6 opacity-60" />
        </div>
        <div
          className="absolute top-40 right-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <Star className="text-yellow-300 w-5 h-5 opacity-50" />
        </div>
        <div
          className="absolute bottom-32 left-32 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          <Film className="text-purple-400 w-4 h-4 opacity-40" />
        </div>
        <div
          className="absolute bottom-20 right-10 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <Star className="text-pink-400 w-6 h-6 opacity-60" />
        </div>
      </div>

      {/* Main content */}
      <div className=" flex items-center justify-center h-screen sm:px-10 lg:px-20 relative z-20">
        <div className="relative w-full max-w-lg">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/10 hover:bg-white/15 transition-all duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-[250px] h-20 rounded-2xl mb-4">
                <img
                  src={logoWeb}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
                Welcome to CineZone
              </h2>
              <p className="text-gray-300 text-md">
                Your cinematic journey begins here
              </p>
            </div>
            <div className="space-y-2">
              {/* Email input - Fixed */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400 z-10">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-12 pr-4 py-3 text-base border-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition-all duration-300 border-white/10 hover:border-white/40 backdrop-blur-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {/* Fixed error message position */}
                <div className="absolute -bottom-6 left-0 w-full">
                  {errors.email && (
                    <p className="text-sm text-red-400 animate-pulse">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password input - Fixed */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400 z-10">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-12 pr-12 py-3 text-base border-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition-all duration-300 border-white/10 hover:border-white/40 backdrop-blur-sm"
                  placeholder="Enter password"
                  value={formData.password}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200 z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-400 hover:text-purple-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-400 hover:text-purple-300" />
                  )}
                </button>
                {/* Fixed error message position */}
                <div className="absolute -bottom-6 left-0 w-full">
                  {errors.password && (
                    <p className="text-sm text-red-400 animate-pulse">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Forgot password */}

              <div className="w-full flex justify-end mb-2">
                <Link
                  to="/forgot"
                  className="text-purple-400 hover:text-purple-300 hover:underline text-sm font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="button"
                  disabled={isLoading || Object.keys(errors).length > 0}
                  onClick={handleSubmit}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-150 transform ${
                    isLoading || Object.keys(errors).length > 0
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-purple-400 to-purple-600 text-white active:scale-[1.05] hover:brightness-105 shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                      <span className="text-base">Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </div>
            {/* Register link */}

            <p className="mt-6 text-center text-base text-gray-300">
              New to CineZone?{" "}
              <Link
                to="/register"
                className="font-semibold text-purple-400 hover:text-purple-300 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom animation delays */}
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
export default MovieTheaterLogin;
