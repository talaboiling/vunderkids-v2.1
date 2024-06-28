import League from "./dashboard_sections/League";
import Ratinglist from "./dashboard_sections/Ratinglist";
import placeholderPfp from "../assets/placehoder_pfp.png"; // Import the placeholder image
import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchRatings } from "../utils/apiService";
import { useTranslation } from "react-i18next";

const Profile = ({ user }) => {
  const { t } = useTranslation();
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null
  const [ratings, setRatings] = useState([]); // State to store ratings

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
  return (
    <div className="dashProfile">
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
          {t ('myProfile')}
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
          {t ('student')}
        </p>
      </div>
      <League />
      <Ratinglist ratings={ratings} />
    </div>
  );
};

export default Profile;
