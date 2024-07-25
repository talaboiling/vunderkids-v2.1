import React, { useState } from "react";
import mascotImg from "./assets/lionmascot_main.svg";
import logoImg from "./assets/logo_blue.png";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./utils/authService";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { getUserRole, isAuthenticated } from "./utils/authService.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { slide as Menu } from "react-burger-menu";


function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const role = getUserRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
      <div className="headerImg">
        <div className="navBar">
          <div className="logo">
            <Link to="/" style={{ textDecoration: "none" }}>
              <img className="navLogo" src={logoImg} alt="logo" />
            </Link>
            <span>
            <p className="rev">Наши контакты:</p>
            <p className="rev">+7 775 303 7432</p>
          </span>
          </div>
          <div className="excLogo">
            <div className="navList">
              <a href="#oplatforme" className="navLink">
                {t('aboutPlatform')}
              </a>
              <a href="#obuchenie" className="navLink">
                {t('education')}
              </a>
              <a href="#otzyvy" className="navLink">
                {t('reviews')}
              </a>
              <a href="#contakty" className="navLink">
                {t('contacts')}
              </a>
            </div>
            <div className="langSelector">
              <button className="transBtn" onClick={() => i18next.changeLanguage('ru')}>РУС</button>
              <button className="transBtn" onClick={() => i18next.changeLanguage('kk')}>ҚАЗ</button>
            </div>
            <div className="navButton mob-right">

              {isLoggedIn ? (
                  <div className="mob-right"  >
                    <Link
                        to={`${role === "superadmin" ? "/admindashboard" : role === "supervisor" ? "/supervisor-dashboard" : role === "parent" ? "/parent" : "/dashboard"}`}
                        className="mob-right" style={{textDecoration: "none"}}>
                      <button>{t('continue')}</button>
                    </Link>
                    <button className="orangeButton mob-none" onClick={handleLogout}>
                      {t('exit')}
                    </button>
                  </div>
              ) : (
                  <div className="mob-right"  >
                    <Link to="/login" className="mob-right">
                      <button>{t('enter')}</button>
                    </Link>
                    <Link to="/registration" className="orangeButtonWrapper">
                      <button className="orangeButton mob-none">{t('register')}</button>
                    </Link>
                  </div>
              )}
            </div>
            <div className="menuWrapper" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} style={{color: "#00639E"}}/>
            </div>
          </div>
        </div>
        <Menu isOpen={isOpen} onStateChange={handleStateChange}>
          <a href="#oplatforme" className="menu-item" onClick={() => setIsOpen(false)}>
            {t('aboutPlatform')}
          </a>
          <a href="#obuchenie" className="menu-item" onClick={() => setIsOpen(false)}>
            {t('education')}
          </a>
          <a href="#otzyvy" className="menu-item" onClick={() => setIsOpen(false)}>
            {t('reviews')}
          </a>
          <a href="#contakty" className="menu-item" onClick={() => setIsOpen(false)}>
            {t('contacts')}
          </a>
          <div className="langSelector">
            <button className="" onClick={() => i18next.changeLanguage('ru')}>РУС</button>
            <button className="" style={{marginLeft: "15px"}} onClick={() => i18next.changeLanguage('kk')}>ҚАЗ</button>
          </div>
          <div className="navButton">
            {isLoggedIn ? (
                <div>
                  <button className="orangeButton" onClick={handleLogout}>
                    {t('exit')}
                  </button>
                </div>
            ) : (
                <div>
                  <Link to="/registration" className="orangeButtonWrapper">
                    <button className="orangeButton" style={{width: "100%"}}>{t('register')}</button>
                  </Link>
                </div>
            )}
          </div>
          <span>
            <p className="rev">Наши контакты:</p>
            <p className="rev">+7 775 303 7432</p>
          </span>
        </Menu>
        <div className="hooks">
          <div className="hook1">
            <div className="hook1Desc">
              <p className="mob-text" style={{fontWeight: 600, margin: 0}}>
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
            <img src={mascotImg} alt="lionimg" className="mascotImg" />
          </div>
        </div>
      </div>
  );
}

export default Header;