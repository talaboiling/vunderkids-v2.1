import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "/src/assets/logo_blue.png";
import { registerParent } from "../utils/apiService"; // Import the function
import { useTranslation } from "react-i18next";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone,
      first_name: formData.first_name,
      last_name: formData.last_name,
    };

    try {
      const data = await registerParent(body); // Use the function from apiService
      setResponseMessage(`Success: ${data.message}`);
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
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
                {t ('aboutPlatform')}
              </a>
              <a href="/#obuchenie" className="navLink">
                {t ('education')}
              </a>
              <a href="/#otzyvy" className="navLink">
                {t ('reviews')}
              </a>
              <a href="/#contakty" className="navLink">
                {t ('contacts')}
              </a>
            </div>
            <div className="navButton" style={{ marginLeft: "80px" }}>
              <Link to={"/login"}>
                <button>{t ('enter')}</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="regPage">
          <div className="regform">
            <div className="formTitle">
              <h3 className="form-h3">{t ('createParentAccount')}</h3>
              <Link to="/login" className="formLink">
                {t ('haveAccount')}
              </Link>
            </div>
            <form className="inputField" onSubmit={handleSubmit}>
              <label htmlFor="first_name">{t ('firstNameChild')}</label>
              <br />
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Мақсат"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
              <br />

              <label htmlFor="last_name">{t ('lastNameChild')}</label>
              <br />
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Бектұрғын"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
              <br />

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
                  <label htmlFor="phone">{t ('phone')}</label>
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
              <label htmlFor="password">{t ('comeUpWithPassword')}</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <br />
              <input
                type="submit"
                value={t ('registration')}
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
            {responseMessage && <p>{responseMessage}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
