import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { http } from "../serverConfig.json";
import { Context } from "../context/context";

const RefreshToken = () => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const { setUserInfo, userInfo } = context;

  useEffect(() => {
    let isMounted = true;
    const refresh = async () => {
      try {
        const token = localStorage.getItem("refresh");

        if (!token) return;
        // Try to refresh the token
        const response = await axios.post(`${http}/api/token/refresh/`, {
          refresh: token,
        });
        if (response.data?.access) {
          localStorage.setItem("token", response.data.access);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token refresh error:", error);
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

  return;
};

export default RefreshToken;
