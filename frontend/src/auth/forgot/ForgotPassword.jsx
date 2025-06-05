import { useState, useEffect } from "react";
import { Mail, ArrowLeft, Film, Star, Shield, Clock } from "lucide-react";
import imageLogin1 from "../../assets/imageLogin1.jpg";
import imageLogin2 from "../../assets/imageLogin2.jpg";
import imageLogin3 from "../../assets/imageLogin3.jpg";
import imageLogin4 from "../../assets/imageLogin4.jpg";

const MovieForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Movie backgrounds - mock images for demo
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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 2000);
    }
  };

  const handleBackToLogin = () => {
    // Reset form khi quay lại login
    setFormData({ email: "" });
    setErrors({});
    setIsSuccess(false);
    setIsLoading(false);
    // navigate("/login"); // Uncomment when using with router
  };

  return (
    <div className="relative overflow-hidden">
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
        <div
          className="absolute -top-4 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

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
          <Shield className="text-purple-400 w-4 h-4 opacity-40" />
        </div>
        <div
          className="absolute bottom-20 right-10 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <Clock className="text-pink-400 w-6 h-6 opacity-60" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen sm:px-10 lg:px-20 relative z-20 py-8">
        <div className="relative w-full max-w-lg">
          {/* Glass morphism card */}
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/10 hover:bg-white/15 transition-all duration-500">
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl mb-4 shadow-xl">
                    <Shield className="text-white w-10 h-10" />
                  </div>

                  <h2 className="text-2xl font-extrabold text-white mb-3">
                    Forgot Password?
                  </h2>

                  <p className="text-gray-300 text-md">
                    Don't worry, we'll send you reset instructions
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email Input - Completely fixed layout */}
                  <div className="relative group mb-8">
                    <div
                      className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 z-10 ${
                        focusedField === "email"
                          ? "text-purple-500"
                          : "text-gray-400"
                      }`}
                    >
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      className={`block w-full pl-12 pr-4 py-3 text-base border-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                        errors.email
                          ? "border-red-400"
                          : "border-white/10 hover:border-white/40"
                      } backdrop-blur-sm`}
                      placeholder="Enter your email address"
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

                  {/* Reset Button */}
                  <div>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleSubmit}
                      className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-150 transform ${
                        isLoading
                          ? "bg-gray-600 cursor-not-allowed text-gray-300"
                          : "bg-gradient-to-r from-purple-400 to-purple-600 text-white active:scale-[1.05] hover:brightness-105 shadow-lg"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                          <span className="text-base">Sending...</span>
                        </div>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </button>
                  </div>

                  {/* Back to Login */}
                  <div>
                    <button
                      onClick={handleBackToLogin}
                      className="w-full py-3 px-6 rounded-xl font-medium text-lg text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105"
                    >
                      <ArrowLeft className="w-5 h-5 mr-3 inline" />
                      Back to Login
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl lg:rounded-3xl mb-4 sm:mb-6 shadow-xl animate-pulse">
                  <Mail className="text-white w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent mb-4 sm:mb-6 lg:mb-8">
                  Check Your Email
                </h2>
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 text-gray-300">
                  <p className="text-sm sm:text-lg lg:text-xl">
                    We've sent password reset instructions to:
                  </p>
                  <p className="font-semibold text-white text-sm sm:text-lg lg:text-2xl bg-white/10 py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl lg:rounded-2xl border border-white/10 break-all">
                    {formData.email}
                  </p>
                  <p className="text-sm sm:text-lg lg:text-xl">
                    Click the link in the email to reset your password.
                  </p>
                  <div className="flex items-center justify-center text-xs sm:text-sm lg:text-lg text-gray-400 mt-4 sm:mt-6 lg:mt-8">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1 sm:mr-2" />
                    Link expires in 15 minutes
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 lg:mt-12 space-y-3 sm:space-y-4 lg:space-y-5">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({ email: "" });
                    }}
                    className="w-full py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-xl font-medium text-sm sm:text-lg lg:text-xl text-orange-400 bg-white/5 border border-orange-400/30 hover:bg-orange-400/10 hover:text-orange-300 transition-all duration-300"
                  >
                    Resend Email
                  </button>

                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 rounded-xl font-medium text-sm sm:text-lg lg:text-xl text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 inline" />
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Floating elements */}
          <div className="absolute -top-4 sm:-top-6 lg:-top-8 -right-4 sm:-right-6 lg:-right-8 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-6 -left-3 sm:-left-4 lg:-left-6 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full opacity-40 animate-pulse"></div>
        </div>
      </div>
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MovieForgotPassword;
