import React from "react";
import mascotImg from "./assets/mascotImg.png";
import logoImg from "./assets/logo_blue.png";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./utils/authService";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("access_token") !== null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const { t } = useTranslation();
  return (
    <div className="headerImg">
      <div className="navBar">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img className="navLogo" src={logoImg} alt="logo" />
        </Link>
        <div className="excLogo">
          <div className="navList">
            <a href="#oplatforme" className="navLink">
              { t('aboutPlatform')}
            </a>
            <a href="#obuchenie" className="navLink">
              { t('education')}
            </a>
            <a href="#otzyvy" className="navLink">
              {t('reviews')}
            </a>
            <a href="#contakty" className="navLink">
              {t('contacts')}
            </a>
          </div>
          <div className="navButton">
            <div className="langSelector">
              <button className="transBtn" onClick={() => i18next.changeLanguage('ru')}>РУС</button>
              <button className="transBtn" onClick={() => i18next.changeLanguage('kk')}>ҚАЗ</button>
            </div>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <button>{t('continue')}</button>
                </Link>
                <button className="orangeButton" onClick={handleLogout}>
                  {t('exit')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button>{t('enter')}</button>
                </Link>
                <Link to="/registration">
                  <button className="orangeButton">{t('register')}</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="hooks">
        <div className="hook1">
          <div className="hook1Desc">
            <p style={{ fontWeight: 600, margin: 0 }}>
              {t('eduAge')}
            </p>
            <div className="hook1Title">
              <span className="spanAnim">
                <h1>{t('mathEng1')}</h1>
              </span>
              <span className="spanAnim">
                <h1>{t('mathEng2')}</h1>
              </span>
              <span className="spanAnim">
                <h1>{t('mathEng3')}</h1>
              </span>
            </div>
            <Link to="/registration">
              <button
                style={{
                  padding: "10px 17px",
                  width: "60%",
                  marginTop: "2rem",
                  borderColor: "white",
                }}
              >
                {t('tryForFree')}
              </button>
            </Link>
          </div>
          <img src={mascotImg} alt="lionimg" style={{ scale: "0.8" }} />
        </div>
      </div>
    </div>
  );
}

export default Header;
