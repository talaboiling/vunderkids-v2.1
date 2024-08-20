import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Activate.css"; // Import the CSS file for styling
import { useTranslation } from "react-i18next";

const Payment = () => {
    const { t } = useTranslation();
    // const { activation_token } = useParams(); // Capture the token from the URL
    // const [message, setMessage] = useState("");
    //const [isSuccess, setIsSuccess] = useState(false); // Track success state for styling

  return (
    <div className={`activate-container success`}>
      <div className="activate-card">
        <h1 className="activate-message">Поздравляем!</h1>
          <p className="activate-instruction">
            {t ('Ваша оплата прошла успешно. Теперь для вас доступен премиум контент!')}
          </p>
        <a href="/parent" className="activate-home-button">
          {t ('Войти в Кабинет')}
        </a>
      </div>
    </div>
  )
}

export default Payment