import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from "/src/assets/logo_blue.png";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;
      if (response.status === 200) {
        // Store the tokens and user info as needed
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        const user = data.user;
        setResponseMessage("Login successful!");
        if (user.role === "parent") {
          navigate("/parent"); // Redirect parent to dashboard
        } else if (user.role === "student") {
          navigate("/dashboard"); // Redirect to student dashboard
        } else if (user.is_superuser) {
          navigate("/admindashboard"); // Redirect to dashboard
        } else {
          navigate("/dashboard");
        }
      } else {
        setResponseMessage("Login failed!");
      }
    } catch (error) {
      setResponseMessage("Error: " + error.response.data.detail);
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
                О ПЛАТФОРМЕ
              </a>
              <a href="/#obuchenie" className="navLink">
                ОБУЧЕНИЕ
              </a>
              <a href="/#otzyvy" className="navLink">
                ОТЗЫВЫ
              </a>
              <a href="/#contakty" className="navLink">
                КОНТАКТЫ
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
              <h3 className="form-h3">Войти в Аккаунт</h3>
              <Link to={"/registration"} className="formLink">
                У меня нет аккаунта
              </Link>
            </div>
            <form className="inputField" onSubmit={handleSubmit}>
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
                    style={{ minWidth: "350px" }}
                  />
                </span>
              </span>
              <label htmlFor="password">Ваш пароль:</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{ maxWidth: "350px" }}
              />
              <br />
              <input
                type="submit"
                value="Войти"
                className="orangeButton"
                style={{
                  position: "relative",
                  maxWidth: "200px",
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

export default Login;
