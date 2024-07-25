import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "/src/assets/logo_blue.png";
import { registerParent } from "../utils/apiService"; // Import the function
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { dialogActionsClasses } from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {slide as Menu} from "react-burger-menu";

function Registration() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    first_name: "",
    last_name: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setResponseMessage(t("Пароль должен содержать минимум 8 символов, 1 заглавную букву и 1 цифру"));
      setShowModal(true);
      return;
    }

    if (!captchaValue) {
      setResponseMessage(t("Пожалуйста пройдите CAPTCHA."));
      setShowModal(true)
      return;
    }

    const body = {
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone,
      first_name: formData.first_name,
      last_name: formData.last_name,
      captcha: captchaValue,
    };

    try {
      const data = await registerParent(body); // Use the function from apiService
      setResponseMessage(`${data.message}`);
      setShowModal(true);
    } catch (error) {
      setResponseMessage(`Ошибка: ${error.message}`);
      setShowModal(true);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="regacss">
        <div className="navBar" style={{ justifyContent: "space-around" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              className="navLogo"
              src={logoImg}
              alt="logo"
              style={{ marginRight: "100px" }}
            />
          </Link>
          <div className="excLogo">
            <div className="navList">
              <a href="/#oplatforme" className="navLink">
                {t("aboutPlatform")}
              </a>
              <a href="/#obuchenie" className="navLink">
                {t("education")}
              </a>
              <a href="/#otzyvy" className="navLink">
                {t("reviews")}
              </a>
              <a href="/#contakty" className="navLink">
                {t("contacts")}
              </a>
            </div>
            <div className="navButton" style={{marginLeft: "80px"}}>
              <Link to={"/login"}>
                <button>{t("enter")}</button>
              </Link>
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
        </Menu>
        <div className="regPage">
          <div className="regform">
            <div className="formTitle">
            <h3 className="form-h3">{t("createParentAccount")}</h3>
              <Link to="/login" className="formLink">
                {t("haveAccount")}
              </Link>
            </div>
            <form className="registrationInput" onSubmit={handleSubmit}>
              <label htmlFor="first_name">{t("firstNameChild")}</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Мақсат"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="last_name">{t("lastNameChild")}</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Бектұрғын"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
              <span className="gendemail">
                <span>
                  <label htmlFor="email">E-mail:</label>
                  <br />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="maksat01@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{ width: "350px" }}
                  />
                </span>
                <span>
                  <label htmlFor="phone">{t("phone")}</label>
                  <br />
                  <input
                    type="phone"
                    id="phone"
                    name="phone"
                    placeholder="+7 (777) 1234567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{ width: "350px" }}
                  />
                </span>
              </span>
              <label htmlFor="password">{t("comeUpWithPassword")}</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              
              <ReCAPTCHA
                sitekey="6LdOuxAqAAAAAOZuSbWfPWcvYSbu-vMtAmhYM5f7"
                onChange={handleCaptchaChange}
              />
              
              <input
                type="submit"
                value={t("registration")}
                className="orangeButton"
                style={{
                  position: "relative",
                  maxWidth: "200px",
                  float: "left",
                  marginTop: "25px",
                  marginBottom: "0",
                }}
              />
            </form>
          </div>
          {showModal && (
            <dialog className="modal supermodal">
              <div className="modal-content" style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem"}}>
                {responseMessage}
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    borderRadius:"10px",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    color:"#666",
                  }}
                >
                  {(t("continue"))}
                </button>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </>
  );
}

export default Registration;
