import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { http } from "../serverConfig.json";

const RefreshToken = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const refresh = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        // Try to refresh the token
        const response = await axios.post(`${http}/api/token/refresh/`, {
          token,
        });
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    // Refresh every 4 minutes (240000 ms)
    const interval = setInterval(refresh, 240000);
    // Initial refresh on mount
    refresh();
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigate]);

  return null;
};

export default RefreshToken;
