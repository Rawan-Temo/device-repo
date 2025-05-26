import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Context = createContext({});

const userLanguage = navigator.language || navigator.userLanguage;
const userLang = userLanguage.startsWith("ar") ? "AR" : "EN";
const Provider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [mode, setMode] = useState(+localStorage.getItem("isDark") || false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || userLang || "EN"
  );
  const [selectedLang, setSelectedLang] = useState({});

  useEffect(() => {
    localStorage.setItem("isDark", mode ? 1 : 0);
    document.body.classList.toggle("dark", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.body.classList.toggle("arabic", language === "AR");
  }, [language]);

  useEffect(() => {
    const h2Active = document.querySelector(".languages h2.active");
    const h2 = document.querySelectorAll(".languages h2");
    h2Active && h2Active.classList.remove("active");
    localStorage.setItem("language", language);
    h2.forEach((e) => e.dataset.lang === language && e.classList.add("active"));
    document.body.classList.toggle("arabic", language === "AR");
  }, [language]);

  const getLang = async () => {
    try {
      const response = await axios.get(`/${language}.json`);
      setSelectedLang(response.data);
    } catch (error) {
      console.log(" ")("Language file load error:", error);
    }
  };

  useEffect(() => {
    getLang();
  }, [language]);

  // const refreshToken = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     setUserInfo(token);
  //   } catch (error) {
  //     console.error("Error refreshing token:", error);
  //   }
  // };
  // useEffect(() => {
  //   if (!userInfo.access) {
  //     refreshToken();
  //   } 
  // }, [userInfo.access]);

  return (
    <Context.Provider
      value={{
        mode,
        setMode,
        language,
        setLanguage,
        selectedLang,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AppProvider = Provider;
