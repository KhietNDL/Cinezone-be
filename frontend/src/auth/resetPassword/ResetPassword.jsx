/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  Film,
  Star,
} from "lucide-react";
import imageLogin1 from "../../assets/imageLogin1.jpg";
import imageLogin2 from "../../assets/imageLogin2.jpg";
import imageLogin3 from "../../assets/imageLogin3.jpg";
import imageLogin4 from "../../assets/imageLogin4.jpg";
import { resetPassword } from "../../services/API";
import { getCurrentMovies } from "../../services/API";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  const [movieBackgrounds, setMovieBackgrounds] = useState([
    imageLogin1,
    imageLogin2,
    imageLogin3,
    imageLogin4,
  ]);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const data = await getCurrentMovies();
        const posters = data?.data
          ?.map((movie) => {
            if (!movie.PosterImage) return null;
            if (movie.PosterImage.startsWith("http")) return movie.PosterImage;
            return `http://cinezone:4458${movie.PosterImage}`;
          })
          .filter(Boolean);
        setMovieBackgrounds(
          posters && posters.length > 0
            ? posters
            : [imageLogin1, imageLogin2, imageLogin3, imageLogin4]
        );
      } catch {
        setMovieBackgrounds([
          imageLogin1,
          imageLogin2,
          imageLogin3,
          imageLogin4,
        ]);
      }
    };
    fetchPosters();
  }, []);

  // Auto change background every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(
        (prevIndex) => (prevIndex + 1) % movieBackgrounds.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [movieBackgrounds.length]);

  // Success redirect simulation
  useEffect(() => {
    if (isSuccess) {
      const redirectTimer = setTimeout(() => {
        navigate("/login");
        console.log("Redirecting to login...");
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isSuccess, navigate]);

  // Password strength checker
  useEffect(() => {
    const password = formData.newPassword;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    setPasswordStrength({ score, checks });
  }, [formData.newPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const validateForm = () => {
    const password = formData.newPassword.trim();

    if (!password) {
      setError("New password is required");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (password.length > 128) {
      setError("Password must be less than 128 characters");
      return false;
    }

    if (passwordStrength.score < 4) {
      setError("Password is too weak. Please meet all requirements");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const credentials = {
        newPassword: formData.newPassword.trim(),
      };

      console.log("Sending data:", credentials);

      const response = await resetPassword(credentials);

      // Handle successful response
      console.log("Password reset successful:", response);
      setIsSuccess(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      // API error from our custom handler
      if (error.response?.data?.error || error.response?.data?.message) {
        setError(error.response.data.error || error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Failed to reset password. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.score < 2) return "bg-red-500";
    if (passwordStrength.score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength.score < 2) return "Weak";
    if (passwordStrength.score < 4) return "Medium";
    return "Strong";
  };

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden h-screen">
        {/* Background slideshow */}
        <div className="absolute inset-0">
          {movieBackgrounds.map((bg, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentBgIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${bg})`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40" />
        </div>

        {/* Success content */}
        <div className="h-screen flex items-center justify-center px-8 relative z-20">
          <div className="relative w-full max-w-lg">
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-[2rem] shadow-2xl border border-white/10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl mb-6 shadow-xl">
                  <CheckCircle className="text-white w-10 h-10" />
                </div>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent mb-4">
                  Password Reset!
                </h2>
                <p className="text-gray-300 text-md mb-2">
                  Your password has been changed successfully
                </p>
                <p className="text-gray-400 text-sm">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-screen">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {movieBackgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
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
      <div className="flex items-center justify-center h-screen sm:px-10 lg:px-20 relative z-20">
        <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-[2rem] shadow-2xl border border-white/10 hover:bg-white/15 transition-all duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-600 rounded-3xl mb-6 shadow-xl">
                <Shield className="text-white w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                Reset Your Password
              </h2>
              <p className="text-gray-300 text-md mb-2">
                Create a strong new password for your account
              </p>
            </div>

            <div className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-200"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 pr-12 border-2 border-white/20 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:border-white/30"
                    placeholder="Enter your new password"
                    required
                    minLength={8}
                    maxLength={128}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Password Strength
                      </span>
                      <span
                        data-testid="password-strength-label"
                        className={`text-xs font-medium ${
                          passwordStrength.score < 2
                            ? "text-red-400"
                            : passwordStrength.score < 4
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div
                        className={`flex items-center space-x-1 ${
                          passwordStrength.checks.length
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <span>•</span>
                        <span>8+ characters</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 ${
                          passwordStrength.checks.uppercase
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <span>•</span>
                        <span>Uppercase</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 ${
                          passwordStrength.checks.lowercase
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <span>•</span>
                        <span>Lowercase</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 ${
                          passwordStrength.checks.number
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <span>•</span>
                        <span>Number</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 ${
                          passwordStrength.checks.special
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <span>•</span>
                        <span>Special char</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-sm text-center animate-pulse">
                  {error}
                </p>
              )}

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || !formData.newPassword.trim()}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-150 transform ${
                    loading || !formData.newPassword.trim()
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-purple-400 to-purple-600 text-white active:scale-[1.05] hover:brightness-105 shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                      <span className="text-base">Updating Password...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-base text-gray-300">
              Remember your password?{" "}
              <a
                href="#"
                className="font-semibold text-purple-400 hover:text-purple-300 hover:underline"
              >
                Back to login
              </a>
            </p>
          </div>
        </form>
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

export default ResetPassword;
