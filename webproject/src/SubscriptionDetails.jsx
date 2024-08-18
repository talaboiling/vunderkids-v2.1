import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./assets/logo_blue.webp";
import i18next from "i18next";
import { getUserRole, isAuthenticated } from "./utils/authService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { slide as Menu } from "react-burger-menu";
const SubscriptionDetails = () => {
  const { t } = useTranslation();
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const role = getUserRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="contain"
      style={{ height: "100vh" }}
    >
      <div className="navBar" style={{boxShadow:"0 -5px 10px black"}}>
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img className="navLogo" src={logoImg} alt="logo" />
          </Link>
          <span>
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
                <>
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
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button>{t("enter")}</button>
                  </Link>
                  <Link to="/registration">
                    <button className="orangeButton">{t("register")}</button>
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
      <div className="subscriptionBanners" style={{ marginTop: "40px" }}>
        <div className="certbanner" style={{ width: "500px" }}>
          <p
            className="defaultStyle"
            style={{
              fontSize: "xx-large",
              fontWeight: "800",
              color: "white",
              textAlign: "center",
              textWrap: "wrap",
              zIndex: "-1",
            }}
          >
            {t("premiumPlans")}
          </p>
        </div>
        <div className="subBanners">
          <div className="subBanner subban-1">
            <div className="subBanner-content">
              <p className="submonth">6 {t("months")}</p>
              <span>
                <strong
                  style={{
                    margin: "0",
                    fontSize: "xx-large",
                    fontWeight: "900",
                  }}
                >
                  9 990
                </strong>{" "}
                тг
              </span>
              <p
                style={{
                  width: "250px",
                  textAlign: "center",
                  color: "#444",
                  fontWeight: "500",
                  margin: "0",
                }}
              >
                {t("standardForStart")}
              </p>
              <button
                style={{
                  backgroundColor: "#F8753D",
                  fontWeight: "550",
                  fontSize: "large",
                  borderColor: "#FFB99C",
                  boxShadow: "none",
                }}
              >
                {t("choose")}
              </button>
            </div>
          </div>
          <div className="subBanner subban-2">
            <div className="subBanner-content">
              <p className="submonth">12 {t("months")}</p>
              <span>
                <strong
                  style={{
                    margin: "0",
                    fontSize: "xx-large",
                    fontWeight: "900",
                  }}
                >
                  15 990
                </strong>{" "}
                тг
              </span>
              <p
                style={{
                  margin: "0",
                  width: "250px",
                  textAlign: "center",
                  color: "#444",
                  fontWeight: "500",
                }}
              >
                {t("standardForStart")}
              </p>
              <button
                style={{
                  backgroundColor: "#F8753D",
                  fontWeight: "550",
                  fontSize: "large",
                  borderColor: "#FFB99C",
                  boxShadow: "none",
                }}
              >
                {t("choose")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;