import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "/src/assets/logo_blue.png";
import { loginUser, logout } from "../utils/authService";
import { useTranslation } from "react-i18next";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(formData.email, formData.password);
      setResponseMessage(t ('loginSuccessful'));
      if (user.role === "parent") {
        navigate("/parent"); // Redirect parent to dashboard
      } else if (user.role === "student") {
        navigate("/dashboard"); // Redirect to student dashboard
      } else if (user.is_superuser) {
        navigate("/admindashboard"); // Redirect to dashboard
      } else if (user.role === "supervisor") {
        navigate("/supervisor-dashboard"); // Redirect to dashboard
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setResponseMessage("Error: " + error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
          </div>
        </div>
        <div
          className="regPage"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="regform">
            <div className="formTitle">
              <h3 className="form-h3">{t ('login')}</h3>
              <Link to={"/registration"} className="formLink">
                {t ('noAccount')}
              </Link>
            </div>
            <form className="registrationInput" onSubmit={handleSubmit}>
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="maksat01@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">{t ('yourPassword')}</label>
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
                value={t ('loginButton')}
                className="orangeButton"
                style={{
                  position: "relative",
                  maxWidth: "200px",
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

export default Login;
