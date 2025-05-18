import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
// import { useServerStatus } from "../useServerStatus";
import "./Header.css";

import ToggleMode from "./ToggleMode";
import { Context } from "../context/context";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const miniSidebarRef = useRef(null);
  const context = useContext(Context);
  // const isConnected = useServerStatus();

  const headerClick = (e) => {
    e.stopPropagation();
    sidebarRef.current?.classList.toggle("active-sidebar");
  };

  const devicesClick = (e) => {
    e.stopPropagation();
    miniSidebarRef.current?.classList.toggle("mini-sidebar-device-d-active");
  };

  useEffect(() => {
    sidebarRef.current?.classList.remove("active-sidebar");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        miniSidebarRef.current &&
        !miniSidebarRef.current.contains(e.target)
      ) {
        sidebarRef.current.classList.remove("active-sidebar");
        miniSidebarRef.current.classList.remove("mini-sidebar-device-d-active");
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const selectLang = (e) => {
    context.setLanguage(e.target.dataset.lang);
  };
  window.addEventListener("click", () => {
    const langDiv = document.querySelector(".lang + div.languages.active-div");
    langDiv && langDiv.classList.remove("active-div");

    const shortCut = document.querySelector(".short-cut i.plus");
    shortCut && shortCut.classList.remove("active");
    if (window.innerWidth <= 500) {
      const nav = document.querySelector("nav");
      if (!nav.classList.contains("closed")) {
        localStorage.setItem("isClosed", true);
        context?.setIsClosed(true);
        nav && nav.classList.add("closed");
      }
    }
  });
  return (
    <div className="header">
      <div className="toggle flex ">
        <article className="relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              document
                .querySelector(".lang + div.languages")
                .classList.toggle("active-div");
            }}
            className="lang center"
          >
            <i className="fa-solid fa-earth-americas"></i>
          </div>
          <div className="languages">
            <h2
              className={`${context?.language === "AR" ? "active" : ""}`}
              onClick={selectLang}
              data-lang="AR"
            >
              عربي
            </h2>
            <h2
              onClick={selectLang}
              className={`${context?.language === "EN" ? "active" : ""}`}
              data-lang="EN"
            >
              english
            </h2>
            <h2
              onClick={selectLang}
              className={`${context?.language === "KU" ? "active" : ""}`}
              data-lang="KU"
            >
              kurdish
            </h2>
          </div>
        </article>
        <ToggleMode />
        <button className="logout-button" /*onClick={handleLogout}*/>
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <div className="statusSection flex">
        <div onClick={headerClick} className="icon-header">
          <i className="fa-solid fa-bars-staggered"></i>
        </div>
        {(location.pathname.includes("devices") ||
          location.pathname.includes("logs")) && (
          <div onClick={devicesClick} className="icon-device">
            <i className="fa-regular fa-hard-drive"></i>
          </div>
        )}
        {/* Sidebar References */}
        <div ref={sidebarRef} className=".sidebar"></div>
        <div ref={miniSidebarRef} className="mini-sidebar-device-d"></div>{" "}
        {context ? (
          <a>
            <i className="fa-solid fa-link"></i> <span> Connected</span>
          </a>
        ) : (
          <a>
            <i className="fa-solid fa-link-slash"></i>
            <span> Disconnected</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default Header;
