import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./assets/logo_blue.webp";
import i18next from "i18next";
import { getUserRole, isAuthenticated } from "./utils/authService.js";
const SubscriptionDetails = () => {
  const { t } = useTranslation();
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const role = getUserRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div
      className="contain"
      style={{ backgroundColor: "#ccd6eb", height: "100vh" }}
    >
      <div className="navBar">
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
