// Loader.js
import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="spinner" />
      <style jsx>{`
        .spinner {
          border: 10px solid rgba(0, 0, 0, 0.1);
          border-left-color: #09f;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          animation: spin 0.2s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
