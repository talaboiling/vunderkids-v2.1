import React, { useState } from "react";
import logoImg from "/src/assets/logo_blue.webp";
import { useTranslation } from "react-i18next";
import { resetPassword } from "./utils/apiService";
import { useParams, Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const ChangePassword = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const [showModal, setShowModal] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password, confirmPassword) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (!passwordRegex.test(password)) {
      return t(
        "Пароль должен содержать хотя бы одну заглавную букву, одну цифру и не менее 8 символов."
      );
    }
    if (password !== confirmPassword) {
      return t("Пароли не совпадают.");
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      console.log(validationError);
      setMessage(validationError);
      return;
    }
    try {
      await resetPassword(password, token);
      setMessage(t("Пароль успешно изменен!"));
      setShowModal(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="regacss">
      <div className="renewPage">
        <div className="regform">
          <img src={logoImg} alt="logo" className="navLogo" />
          <h2 style={{ animation: "none" }}>{t("passwordRenewal")}</h2>
          <form className="registrationInput" onSubmit={handleSubmit}>
            <label htmlFor="password">{t("Придумайте Пароль")}</label>
            <div className="passwordInputContainer">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <label htmlFor="confirmPassword">{t("Повторите пароль")}</label>
            <div className="passwordInputContainer">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            <button
              type="submit"
              style={{ maxWidth: "200px", marginTop: "20px" }}
            >
              {t("send")}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
      {showModal && (
        <dialog className="modal supermodal">
          <div className="modal-content">
            <h1 style={{ animation: "none" }}>
              {t("Пароль успешно изменен!")}
            </h1>
            <Link to="/">
              <button onClick={() => setShowModal(false)}>
                {t("Войти в аккаунт")}
              </button>
            </Link>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ChangePassword;
