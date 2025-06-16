import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Film, Star } from "lucide-react";
import imageLogin1 from "../../assets/imageLogin1.jpg";
import imageLogin2 from "../../assets/imageLogin2.jpg";
import imageLogin3 from "../../assets/imageLogin3.jpg";
import imageLogin4 from "../../assets/imageLogin4.jpg";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/API";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const RegistrationForm = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    sex: "", // Sẽ convert thành số khi submit
    cccd: "",
  });
  const signIn = useAuth();
  const movieBackgrounds = [imageLogin1, imageLogin2, imageLogin3, imageLogin4];

  // Effect cho background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % movieBackgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 30;

    let label = "Very Weak";
    if (strength >= 80) label = "Very Strong";
    else if (strength >= 60) label = "Strong";
    else if (strength >= 40) label = "Medium";
    else if (strength >= 20) label = "Weak";

    return { strength, label };
  };

  const validateForm = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();
    // Full Name
    if (!fullName) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.length < 6) {
      newErrors.fullName = "Full name must be at least 6 characters";
    } else if (fullName.length > 100) {
      newErrors.fullName = "Full name must be less than 100 characters";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
      newErrors.fullName =
        "Full name cannot contain numbers or special characters";
    }
    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (/\s/.test(formData.email)) {
      newErrors.email = "Email must not contain spaces";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (formData.email.length > 255) {
      newErrors.email = "Email must not exceed 255 characters";
    }
    // Password
    const password = formData.password;

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (password.length > 128) {
      newErrors.password = "Password must be less than 128 characters";
    } else if (/\s/.test(password)) {
      newErrors.password = "Password must not contain whitespace";
    } else if (
      !/(?=.*[a-z])/.test(password) || // ít nhất 1 chữ thường
      !/(?=.*[A-Z])/.test(password) || // ít nhất 1 chữ hoa
      !/(?=.*\d)/.test(password) || // ít nhất 1 số
      !/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password) // ít nhất 1 ký tự đặc biệt
    ) {
      newErrors.password =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
    }
    // Phone Number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    // Date of birth
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    // Sex
    if (!formData.sex.trim()) {
      newErrors.sex = "Sex is required";
    }
    // Identification Card
    if (!formData.cccd.trim()) {
      newErrors.cccd = "Identification Card is required";
    } else if (!/^\d{12}$/.test(formData.cccd)) {
      newErrors.cccd = "Identification Card must be exactly 12 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Nếu là email, tự động chuyển thành chữ thường (lowercase)
    const newValue = name === "email" ? value.toLowerCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        sex: parseInt(formData.sex),
        phoneNumber: formData.phoneNumber,
        cccd: formData.cccd,
      };

      let response;
      response = await register(userData, false);

      setIsLoading(false);

      toast.success("Successfully created a new account!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      if (response.token) {
        signIn(response.token); // Gọi signIn từ AuthContext
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({
        api: error.message || "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen relative">
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
          <Film className="text-purple-400 w-4 h-4 opacity-40" />
        </div>
        <div
          className="absolute bottom-20 right-10 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <Star className="text-pink-400 w-6 h-6 opacity-60" />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-10 py-4 lg:px-20 relative z-20">
        {/* Registration Form */}
        <div className="w-full max-w-lg lg:w-2/5 flex flex-col border border-white/10 bg-gray-600/20 rounded-3xl backdrop-blur-sm">
          <div className="flex-1 px-8 py-6">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-5">
                <h1 className="text-3xl font-bold mb-3 text-white">
                  Create Account
                </h1>
                <p className="text-md text-gray-300">
                  Join us today and get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm text-white placeholder-gray-300 ${
                      errors.fullName ? "border-red-500" : "border-white/10"
                    } focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300`}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm text-white placeholder-gray-300 ${
                      errors.email ? "border-red-500" : "border-white/10"
                    } focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300`}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 pr-12 rounded-lg bg-white/10 border backdrop-blur-sm text-white placeholder-gray-300 ${
                        errors.password ? "border-red-500" : "border-white/10"
                      } focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300`}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-all duration-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            getPasswordStrength(formData.password).strength >=
                            80
                              ? "bg-green-500"
                              : getPasswordStrength(formData.password)
                                  .strength >= 60
                              ? "bg-yellow-500"
                              : getPasswordStrength(formData.password)
                                  .strength >= 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${
                              getPasswordStrength(formData.password).strength
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-sm mt-1 text-gray-300">
                        Strength: {getPasswordStrength(formData.password).label}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Phone and DOB */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-semibold text-white mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm text-white placeholder-gray-300 ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-white/10"
                      } focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300`}
                      placeholder="Your phone"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-semibold text-white mb-2"
                    >
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm text-white placeholder-gray-300 ${
                        errors.dateOfBirth
                          ? "border-red-500"
                          : "border-white/10"
                      } focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 [&::-webkit-calendar-picker-indicator]:invert`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>
                </div>

                {/* CCCD */}
                <div>
                  <label
                    htmlFor="cccd"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Identification Card *
                  </label>
                  <input
                    type="text"
                    id="cccd"
                    name="cccd"
                    value={formData.cccd}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm text-white placeholder-gray-300 ${
                      errors.cccd ? "border-red-500" : "border-white/10"
                    } focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300`}
                    placeholder="Your Identification Card"
                  />
                  {errors.cccd && (
                    <p className="mt-1 text-sm text-red-400">{errors.cccd}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="sex"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Gender *
                  </label>
                  <div className="relative">
                    <select
                      id="sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 pr-10 bg-white/10 backdrop-blur-sm border ${
                        errors.sex ? "border-red-500" : "border-white/10"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer hover:bg-white/15`}
                    >
                      <option
                        value=""
                        disabled
                        style={{
                          backgroundColor: "#1f2937",
                          color: "#d1d5db",
                        }}
                      >
                        Select Gender
                      </option>
                      <option
                        value="1"
                        style={{
                          backgroundColor: "#1f2937",
                          color: "#ffffff",
                        }}
                      >
                        Male
                      </option>
                      <option
                        value="2"
                        style={{
                          backgroundColor: "#1f2937",
                          color: "#ffffff",
                        }}
                      >
                        Female
                      </option>
                      <option
                        value="3"
                        style={{
                          backgroundColor: "#1f2937",
                          color: "#ffffff",
                        }}
                      >
                        Other
                      </option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-400">{errors.sex}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-5 rounded-lg font-semibold transition-all duration-300 transform ${
                    isLoading
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:scale-[1.02] hover:brightness-110 shadow-lg hover:shadow-purple-500/25"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300 font-semibold underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
