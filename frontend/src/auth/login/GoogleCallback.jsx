import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      let userObj = user;
      try {
        userObj = JSON.parse(user);
      } catch (e) {
        console.log(e);
      }

      signIn(token, userObj.UserId || userObj.userId);
      toast.success("Login with Google Successfully!");
      navigate("/");
    } else {
      toast.error("Google login failed!");
      navigate("/login");
    }
  }, [location, signIn, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div>Processing Google login...</div>
    </div>
  );
};

export default GoogleCallback;
