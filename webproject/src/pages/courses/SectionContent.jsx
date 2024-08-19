import React, { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";
import SubscriptionErrorModal from "./SubscriptionErrorModal"; // Import the modal

const SectionContent = ({
  section,
  chapter,
  openVideoModal,
  openTaskModal,
  hasSubscription,
  t,
}) => {
  const [showSubscriptionError, setShowSubscriptionError] = useState(false);

  return (
    <div className="lessonsCont">
      <h2
        className="defaultStyle title"
        style={{ color: "black", fontWeight: "700" }}
      >
        {t("courseStart")}
      </h2>
      <div className="contWrapper">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <hr className="lessonsHr" />
          <h2 className="defaultStyle" style={{ color: "#aaa" }}>
            {section.title} {chapter.title}
          </h2>
          <hr className="lessonsHr" />
        </div>
        {chapter.contents.map((content, contentIndex) => (
          <div className="lessonsLinks" key={contentIndex}>
            {content.content_type === "lesson" ? (
              <div
                className={`vidBlock studVidBlock ${
                  hasSubscription ? "" : "noVidBlock"
                }`}
                onClick={() =>
                  hasSubscription
                    ? openVideoModal(content.video_url)
                    : setShowSubscriptionError(true)
                }
              >
                <div className="thumbcontainer">
                  <img
                    src={bgvideo || "placeholder.png"}
                    alt="vidname"
                    className="taskThumbnail"
                  />
                </div>
                <p
                  style={{
                    backgroundColor: "white",
                    margin: "0",
                    padding: "7px 40px",
                    borderRadius: "10px",
                  }}
                >
                  {content.title}
                </p>
              </div>
            ) : (
              <div
                className={`studVidBlock task ${
                  hasSubscription ? "" : "noTask"
                }`}
                onClick={() =>
                  hasSubscription
                    ? openTaskModal(content.id)
                    : setShowSubscriptionError(true)
                }
              >
                <img
                  src={bgtask || "placeholder.png"}
                  alt="vidname"
                  className="taskThumbnail"
                />
                <p
                  style={{
                    backgroundColor: "white",
                    margin: "0",
                    padding: "7px 40px",
                    borderRadius: "10px",
                    marginBottom: "7px",
                  }}
                >
                  {content.title}
                </p>
                {content.is_completed ? (
                  <div className="completedTask">
                    <VerifiedIcon sx={{ color: "#19a5fc" }} />
                    <strong>{t("youCompletedTask")}</strong>
                  </div>
                ) : (
                  <div className="completedTask incompleteTask">
                    <strong>{t("youHaveNewTask")}</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showSubscriptionError && (
        <SubscriptionErrorModal
          setShowSubscriptionError={setShowSubscriptionError}
          t={t}
        />
      )}
    </div>
  );
};

export default SectionContent;
