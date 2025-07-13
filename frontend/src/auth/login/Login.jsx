import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Film, Star } from "lucide-react";
import logoWeb from "../../assets/logoWeb.png";
import imageLogin1 from "../../assets/imageLogin1.jpg";
import imageLogin2 from "../../assets/imageLogin2.jpg";
import imageLogin3 from "../../assets/imageLogin3.jpg";
import imageLogin4 from "../../assets/imageLogin4.jpg";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/API";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const MovieTheaterLogin = () => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [focusedField, setFocusedField] = useState("");

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const navigate = useNavigate();

  const movieBackgrounds = [imageLogin1, imageLogin2, imageLogin3, imageLogin4];

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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await login({
          email: formData.email,
          password: formData.password,
        });
        console.log("Login API response:", response);

        if (response.token && response.user?.userId) {
          await signIn(response.token, response.user.userId);
          setIsLoading(false);
          toast.success("Login Successfully!");

          navigate("/");
        } else {
          throw new Error("No token in response");
        }
      } catch (error) {
        console.error("Login error:", error.message);
        setIsLoading(false);
        setErrors({ api: error.message || "Login failed. Please try again." });
      }
    }
  };

  const handleGoogleLogin = () => {
    // window.location.href = "http://localhost:4458/api/auth/login-google";
    window.location.href = "http://cinezone:4458/api/auth/login-google";
  };

  return (
    <div className="relative overflow-hidden">
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

      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-4000"></div>
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

      <div className="flex items-center justify-center h-screen sm:px-10 lg:px-20 relative z-20">
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

            {/* Google Sign In Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
                       bg-white text-gray-700 border border-gray-300 flex items-center justify-center space-x-3
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                    <span className="text-base">Signing in with Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-300">OR</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Email input */}
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
                <div className="absolute -bottom-6 left-0 w-full">
                  {errors.email && (
                    <p className="text-sm text-red-400 animate-pulse">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password input */}
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
                <div className="absolute -bottom-6 left-0 w-full">
                  {errors.password && (
                    <p className="text-sm text-red-400 animate-pulse">
                      {errors.password}
                    </p>
                  )}
                  {errors.api && (
                    <p className="text-sm text-red-400 animate-pulse">
                      {errors.api}
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
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-150 transform
                       bg-gradient-to-r from-purple-500 to-purple-600 text-white
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
