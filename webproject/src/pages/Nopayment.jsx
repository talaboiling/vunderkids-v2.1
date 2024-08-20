import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Activate.css"; // Import the CSS file for styling
import { useTranslation } from "react-i18next";

const Nopayment = () => {
    const { t } = useTranslation();
    // const { activation_token } = useParams(); // Capture the token from the URL
    // const [message, setMessage] = useState("");
    //const [isSuccess, setIsSuccess] = useState(false); // Track success state for styling

  return (
    <div className={`activate-container error`}>
      <div className="activate-card">
        <h1 className="activate-message">Упс! Что-то пошло не так.</h1>
          <p className="activate-instruction">
            {t ('Возможно оплата прошла неуспешно. Можете повторить заново!')}
          </p>
        <a href="/" className="activate-home-button">
          {t ('Домой')}
        </a>
      </div>
    </div>
  )
}

export default Nopayment