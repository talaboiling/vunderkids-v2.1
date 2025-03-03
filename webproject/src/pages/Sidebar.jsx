import React from "react";
import "../dashboard.css";
import logo from "../assets/NAV_LOGO.webp";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { logout } from "../utils/authService";
import { useTranslation } from "react-i18next";

const Sidebar = ({isMenuOpen}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Parse user information from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goBack = () => {
    console.log(user);
    // Conditional navigation based on user role
    if (user.role === "parent") {
      navigate("/parent");
    } else {
      // Handle other user roles if necessary
    }
  };

  return (
    <div className={`sidebar ${isMenuOpen ? "activeMenu" : ""}`}>
      <Link to={"/"}>
        <img src={logo} alt="logo" className="dashsidelogo"/>
      </Link>

      <div className="excSideLogo">
        <ul className="sideItems">
          {SidebarData.map((item, index) => (
            <li
              key={index}
              className="linkbuttons"
              id={window.location.pathname === item.link ? "active" : ""}
              onClick={() => {
                window.location.pathname = item.link;
              }}
            >
              <Link to={item.link} className="linkbuttonVal">
                {item.icon}
                <span className="linkTitle" id="linktit">
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {/* Conditionally render the "Назад" button based on user role */}
        {user.role === "parent" && (
          <button className="exitButton" onClick={goBack}>
            {t("back")}
          </button>
        )}
        <button
          className="exitButton"
          onClick={handleLogout}
          style={{ backgroundColor: "rgb(204, 47, 47)" }}
        >
          {t("exitAccount")}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
