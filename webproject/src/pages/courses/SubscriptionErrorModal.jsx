import React from "react";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const SubscriptionErrorModal = ({ setShowSubscriptionError, t }) => {
  return (
    <dialog className="modal supermodal" open>
      <div
        className="studmodal-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="modalHeader" style={{ marginBottom: "10px" }}>
          <h2 className="defaultStyle" style={{ color: "#666" }}>
            {t("subscriptionRequired")}
          </h2>
          <button
            className="transBtn"
            onClick={() => setShowSubscriptionError(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <p
          style={{
            fontSize: "xx-large",
            maxWidth: "500px",
            textAlign: "center",
            color: "#2060c7",
            border: "1px solid lightgray",
            padding: "10px",
          }}
        >
          {t("subscriptionMessage")}
        </p>
        <Link to="/subscription-details">
          <button className="orangeButton" style={{ fontSize: "x-large" }}>
            {t("gotosubscribe")}
          </button>
        </Link>
      </div>
    </dialog>
  );
};

export default SubscriptionErrorModal;
