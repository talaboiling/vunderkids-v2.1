import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./assets/logo_blue.webp";
import i18next from "i18next";
import { getUserRole, isAuthenticated } from "./utils/authService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faDigitalTachograph } from "@fortawesome/free-solid-svg-icons";
import { slide as Menu } from "react-burger-menu";
import teacher from "./assets/teacher-regBtn.svg";
import parent from "./assets/parent-regBtn.svg";
import student from "./assets/student-regBtn.svg";

const OlympRegRoles = () => {
    const { t } = useTranslation();
    const isLoggedIn = localStorage.getItem("access_token") !== null;
    const role = getUserRole();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const handleLogout = () => {
        logout();
        navigate("/login");
        };
    const dialogRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const handleStateChange = (state) => {
        setIsOpen(state.isOpen);
      };
    const toggleMenu = () => {
        setIsOpen(!isOpen);
      };

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };

    const handleBackgroundClick = (event) => {
      // Close the modal if the click is on the background
      if (event.target === dialogRef.current) {
          setShowModal(false);
      }
  };

  return (
    <div className="contain rules-container">
        <div className="navBar" style={{ boxShadow: "0 -5px 10px black" }}>
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img className="navLogo" src={logoImg} alt="logo" />
          </Link>
          <span style={{paddingRight:"10px"}}>
            <p className="rev">{t("ourContacts")}:</p>
            <p className="rev">+7 775 303 7432</p>
          </span>
        </div>
        <div className="excLogo">
          <div className="navList">
            <div className="navLink dropdown">
              <a href="#oplatforme" className="navLink">
                {t("aboutPlatform")}
              </a>
              <div className="friendly-box"></div>
              <div className="dropdownContent">
                <Link to="/oferty" className="dropdownLink">
                  {t("platformPage1")}
                </Link>
                <Link to="/users-terms-and-conditions" className="dropdownLink">
                  {t("platformPage2")}
                </Link>
              </div>
            </div>
            <a href="/#obuchenie" className="navLink">
              {t("education")}
            </a>
            <a href="/#otzyvy" className="navLink">
              {t("reviews")}
            </a>
            <a href="/#contakty" className="navLink">
              {t("contacts")}
            </a>
            <a href="/subscription-details" className="navLink">
              {t("tariff")}
            </a>
          </div>
          <div className="navButton">
            <div className="langSelector">
              <button
                className="transBtn"
                onClick={() => i18next.changeLanguage("ru")}
              >
                РУС
              </button>
              <button
                className="transBtn"
                onClick={() => i18next.changeLanguage("kk")}
              >
                ҚАЗ
              </button>
            </div>
            <div className="navButton mob-right">
              {isLoggedIn ? (
                <div className="mob-right" style={{display:"flex", flexDirection:"column"}}>
                  <Link
                    to={`${
                      role === "superadmin"
                        ? "/admindashboard"
                        : role === "supervisor"
                        ? "/supervisor-dashboard"
                        : role === "parent"
                        ? "/parent"
                        : "/dashboard"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <button>{t("continue")}</button>
                  </Link>
                  <button className="orangeButton" onClick={handleLogout}>
                    {t("exit")}
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <button>{t("enter")}</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="menuWrapper" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} style={{ color: "#00639E" }} />
        </div>
      </div>
      <Menu isOpen={isOpen} onStateChange={handleStateChange}>
        <a
          href="/#oplatforme"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("aboutPlatform")}
        </a>
        <a
          href="/#obuchenie"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("education")}
        </a>
        <a
          href="/#otzyvy"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("reviews")}
        </a>
        <a
          href="/#contakty"
          className="menu-item burger-contacts"
          onClick={() => setIsOpen(false)}
        >
          {t("contacts")}
        </a>
        <a
          href="/subscription-details"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("tariff")}
        </a>
        <div className="langSelector burger-ln">
          <button className="" onClick={() => i18next.changeLanguage("ru")}>
            РУС
          </button>
          <button
            className=""
            style={{ marginLeft: "15px" }}
            onClick={() => i18next.changeLanguage("kk")}
          >
            ҚАЗ
          </button>
        </div>
        <div className="navButton">
          {isLoggedIn ? (
            <div>
              <Link
                to={`${
                  role === "superadmin"
                    ? "/admindashboard"
                    : role === "supervisor"
                    ? "/supervisor-dashboard"
                    : role === "parent"
                    ? "/parent"
                    : "/dashboard"
                }`}
                style={{ textDecoration: "none" }}
              >
                <button>{t("continue")}</button>
              </Link>
              <button className="orangeButton" onClick={handleLogout}>
                {t("exit")}
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="mob-right burger-login">
                <button>{t("enter")}</button>
              </Link>
              <Link to="/registration" className="orangeButtonWrapper">
                <button className="orangeButton" style={{ width: "100%" }}>
                  {t("register")}
                </button>
              </Link>
            </div>
          )}
        </div>
        <span>
          <p className="rev burger-rev">Наши контакты:</p>
          <p className="rev burger-rev">+7 775 303 7432</p>
        </span>
      </Menu>
      <div className="rules-content" style={{justifyContent:"flex-start"}}>
        <h2 style={{animation:"none", color:"white", maxWidth:"1000px", lineHeight:"normal", textAlign:"center"}}>ДЛЯ УЧАСТИЯ В ОЛИМПИАДЕ, ВЫБЕРИТЕ ВАШУ РОЛЬ</h2>
        <div className="regaRoles">
            <div className="regaRole">
                <Link to={"/registration-for-teachers"}>
                    <img src={teacher} alt="role-teacher" />
                </Link>
                <h2>УЧИТЕЛЬ</h2>
                <p>Для регистраций нескольких учеников</p>
            </div>
            <div className="regaRole">
                <Link to={"/registration-for-parents"}>
                    <img src={parent} alt="role-teacher" />
                </Link>
                <h2>РОДИТЕЛЬ</h2>
                <p>Для регистраций вашего ребенка (детей)</p>
            </div>
            <div className="regaRole">
                <Link to={"/registration-for-students"}>
                    <img src={student} alt="role-teacher" />
                </Link>
                <h2>УЧЕНИК</h2>
                <p>Для регистраций самостоятельно</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default OlympRegRoles