import React from "react";
import { Link } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";

const SectionContent = ({
  sections,
  openVideoModal,
  openTaskModal,
  hasSubscription,
  t,
}) => {
  return (
    <div className="lessonsCont">
      <h2
        className="defaultStyle"
        style={{ color: "black", fontWeight: "700" }}
      >
        {t("courseStart")}
      </h2>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <hr />
            <h2 className="defaultStyle" style={{ color: "#aaa" }}>
              {section.title}
            </h2>
            <hr />
          </div>
          {section.contents.map((content, contentIndex) => (
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
                      ? openTaskModal(content.section, content.id)
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
      ))}
    </div>
  );
};

export default SectionContent;
