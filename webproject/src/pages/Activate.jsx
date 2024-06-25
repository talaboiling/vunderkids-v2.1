import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Activate.css"; // Import the CSS file for styling
import { activateAccount } from "../utils/apiService";
import { useTraslation } from "react-i18next";

const Activate = () => {
  const { t } = useTranslation();
  const { activation_token } = useParams(); // Capture the token from the URL
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Track success state for styling

  useEffect(() => {
    const activate = async () => {
      try {
        const response = await activateAccount(activation_token);
        if (response.status === 200) {
          setMessage("Account successfully activated!");
          setIsSuccess(true);
        } else {
          setMessage("Failed to activate account.");
          setIsSuccess(false);
        }
      } catch (error) {
        setMessage("Invalid or expired activation link.");
        setIsSuccess(false);
      }
    };

    activate();
  }, [activation_token]);

  return (
    <div className={`activate-container ${isSuccess ? "success" : "error"}`}>
      <div className="activate-card">
        <h1 className="activate-message">{message}</h1>
        {isSuccess && (
          <p className="activate-instruction">
            You can now log in to your account.
          </p>
        )}
        <a href="/" className="activate-home-button">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Activate;
