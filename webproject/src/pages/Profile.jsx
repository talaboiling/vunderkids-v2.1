import League from "./dashboard_sections/League";
import Ratinglist from "./dashboard_sections/Ratinglist";
import placeholderPfp from "../assets/placehoder_pfp.png"; // Import the placeholder image
import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchRatings } from "../utils/apiService";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Profile = ({ user, isProfileSwitched, setIsProfileSwitched }) => {
  const { t } = useTranslation();
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
  const [ratings, setRatings] = useState([]); // State to store ratings
    const [checked, setChecked] = useState(i18next.language === 'ru');

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const ratingData = await fetchRatings(childId);
        setRatings(ratingData);
      } catch (error) {
        console.error("Error fetching rating data:", error);
      }
    };
    fetchData();
  }, []);
    const handleChange = () => {
        const newLang = checked ? 'ru' : 'kk';
        i18next.changeLanguage(newLang);
        setChecked(!checked);
    }
  return (
      <div className={`dashProfile ${isProfileSwitched ? "activeProfile" : ""}`}>
          <div className="backButton" onClick={() => setIsProfileSwitched(!isProfileSwitched)}><FontAwesomeIcon icon={faXmark} style={{color: "#339cbd"}}/></div>
          <div className="rndsh gradeNum off">{user.grade || user.gradeNum} {t('studClass')}</div>
          <div className="rndsh langSelect off">
              <div className="button b2" id="button-10">
                  <input type="checkbox" className="checkbox" checked={checked} onChange={handleChange}/>
                  <div className="knobs">
                      <span>ҚАЗ</span>
                  </div>
              </div>
          </div>
          <div className="prowfirst">
              <p
                  style={{
                      fontSize: "x-large",
                      fontWeight: "650",
                      color: "#222222",
                      margin: "0",
                      padding: "0",
                  }}
              >
                  {t('myProfile')}
              </p>
          </div>
          <div className="sidepfp">
              <img
                  src={avatarUrl}
                  alt="pfp"
                  className="pfp"
                  style={{
                      borderRadius: "50%",
                      marginBottom: "15px",
                      width: "110px",
                      height: "110px",
                  }}
              />
              <p
                  style={{
                      fontSize: "x-large",
                      fontWeight: "650",
                      color: "#222222",
                      margin: "0",
                      padding: "0",
                  }}
              >
                  {user.first_name} {user.last_name}
              </p>
              <p
                  style={{
                      fontSize: "large",
                      fontWeight: "450",
                      color: "#222222",
                      margin: "0",
                      padding: "0",
                  }}
              >
                  {t('student')}
              </p>
          </div>
          <League/>
          <Ratinglist ratings={ratings}/>
      </div>
  );
};

export default Profile;
