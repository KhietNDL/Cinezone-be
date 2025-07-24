import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const userParam = params.get("user");
      const error = params.get("error");

      if (error) {
        toast.error("Google login failed: " + error);
        navigate("/login");
        return;
      }

      if (token && userParam) {
        try {
          const userObj = JSON.parse(decodeURIComponent(userParam));
          const success = await signIn(token, userObj.UserId);

          if (success) {
            toast.success("Login with Google Successfully!", {
              toastId: "google-login-success",
            });
            navigate("/");
          } else {
            toast.error("Failed to authenticate user!");
            setIsProcessing(false);
            return;
          }
        } catch (error) {
          console.error("Error processing Google callback:", error);
          toast.error("Google login failed!");
          setIsProcessing(false);
          return;
        }
      } else {
        toast.error("Google login failed - missing parameters!");
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
    };

    processCallback();
  }, [location, signIn, navigate]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Processing Google login...</div>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
