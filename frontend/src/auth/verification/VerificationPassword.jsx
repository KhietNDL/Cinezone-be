/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Film, Star, RotateCcw } from "lucide-react";
import imageLogin1 from "../../assets/imageLogin1.jpg";
import imageLogin2 from "../../assets/imageLogin2.jpg";
import imageLogin3 from "../../assets/imageLogin3.jpg";
import imageLogin4 from "../../assets/imageLogin4.jpg";
import { verification, forgot } from "../../services/API";

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const inputRefs = useRef([]);

  const movieBackgrounds = [imageLogin1, imageLogin2, imageLogin3, imageLogin4];

  useEffect(() => {
    if (!email) {
      console.error("No email provided in location state. Redirecting...");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(
        (prevIndex) => (prevIndex + 1) % movieBackgrounds.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [movieBackgrounds.length]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (isSuccess) {
      const redirectTimer = setTimeout(() => {
        navigate("/resetPassword", { state: { from: "/verification" } });
        console.log("Redirecting to reset password...");
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = verificationCode.join("");
    console.log("Email của tôi", email);

    if (code.length !== 6) {
      setError("Please enter complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const credentials = {
        resetCode: code,
        email: email,
      };

      const response = await verification(credentials);

      if (response) {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error?.message || "Verification failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const requestNewCode = async () => {
    if (attempts >= 3) {
      setError("Maximum resend attempts reached!");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      await forgot({ email });

      setTimeLeft(300);
      setVerificationCode(["", "", "", "", "", ""]);
      setAttempts(attempts + 1);
      inputRefs.current[0]?.focus();

      console.log("New verification code requested for:", email);
    } catch (error) {
      console.error("Resend error:", error);
      setError(
        error?.message || "Failed to resend code. Please try again later!"
      );
    } finally {
      setResendLoading(false);
    }
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
                  <Mail className="text-white w-10 h-10" />
                </div>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent mb-4">
                  Email Verified!
                </h2>
                <p className="text-gray-300 text-md mb-2">
                  Your email has been successfully verified
                </p>
                <p className="text-gray-400 text-sm">
                  Redirecting to reset password page...
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
      <div className="h-screen flex items-center justify-center px-8 relative z-20">
        <div className="relative w-full max-w-lg">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-[2rem] shadow-2xl border border-white/10 hover:bg-white/15 transition-all duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-600 rounded-3xl mb-6 shadow-xl">
                <Mail className="text-white w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                Verify Your Email
              </h2>
              <p className="text-gray-300 text-md mb-2">
                Please enter the 6-digit code sent to your email
              </p>
              {email && (
                <p className="text-purple-300 text-sm mb-2">
                  Code sent to: {email}
                </p>
              )}
              <p className="text-purple-300 text-sm">
                Time remaining: {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>
            </div>

            <div className="space-y-6">
              {/* Verification Code Input */}
              <div className="flex justify-center space-x-3">
                {verificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      error
                        ? "border-red-400"
                        : "border-white/30 hover:border-white/40"
                    }`}
                    aria-label={`Digit ${idx + 1}`}
                  />
                ))}
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
                  onClick={handleSubmit}
                  disabled={loading || verificationCode.join("").length !== 6}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-150 transform ${
                    loading || verificationCode.join("").length !== 6
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-purple-400 to-purple-600 text-white active:scale-[1.05] hover:brightness-105 shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                      <span className="text-base">Verifying...</span>
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </div>

              {/* Resend button */}
              {attempts < 3 && (
                <div className="text-center">
                  <button
                    onClick={requestNewCode}
                    disabled={resendLoading}
                    className="text-purple-400 hover:text-purple-300 font-medium flex items-center justify-center mx-auto space-x-2 text-base hover:underline transition-all duration-200"
                  >
                    {resendLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-purple-400/20 border-t-purple-400 rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>Resend verification code</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {attempts >= 3 && (
                <p className="text-center text-red-400 text-sm">
                  Maximum resend attempts reached. Please contact support.
                </p>
              )}
            </div>
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

export default EmailVerification;
