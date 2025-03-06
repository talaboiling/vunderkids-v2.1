import React from "react";

const VideoModal = ({ videoUrl, closeVideoModal, t }) => {
  return (
    <dialog className="studmodal" open>
      <div className="studmodal-content">
        <div className="modalHeader" style={{ marginBottom: "20px" }}>
          <h2 className="defaultStyle" style={{ color: "#666" }}>
            {t("videoLesson")}
          </h2>
          <button
            style={{
              float: "right",
              backgroundColor: "lightgray",
              border: "none",
              borderRadius: "10px",
              color: "#666",
            }}
            onClick={closeVideoModal}
          >
            {t("close")}
          </button>
        </div>
        <iframe
          style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </dialog>
  );
};

export default VideoModal;
