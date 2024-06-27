import React, { useEffect, useState } from "react";
import axios from "axios";
import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import cupicon from "../../assets/navCups.png";
import League from "./League";
import tempRating from "../../assets/tempMainRating.png";
import placeholderPfp from "../../assets/placehoder_pfp.png"; // Import the placeholder image
import Ratinglist from "./Ratinglist"; // Import the Ratinglist component
import Loader from "../Loader";
import { fetchRatings, fetchUserData } from "../../utils/apiService";

const Rating = () => {
  const [user, setUser] = useState({ first_name: "Ученик", last_name: "" }); // Default values
  const [ratings, setRatings] = useState([]); // State to store ratings
  const [loading, setLoading] = useState(true); // Add loading state
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const [userData, ratingsData] = await Promise.all([
          fetchUserData(childId),
          fetchRatings(childId),
        ]);

        setUser(userData);
        setRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className="rtdash rtrat">
      <Sidebar />
      <div className="centralLessons">
        <Navdash
          starCount={user.stars}
          cupCount={user.cups}
          gradeNum={user.grade}
          notif={3}
        />

        <div className="ratingCentral">
          <div className="ratinginfo">
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
                Мой профиль
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
                  width: "100px",
                  height: "100px",
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
                Ученик
              </p>
            </div>
            <div className="lndsh cupCount">
              <img src={cupicon} alt="cups" className="cupIcon" />
              <p style={{ margin: "0" }}>{user.cups}</p>
            </div>
            <League />
          </div>
          <div className="listInRating">
            <Ratinglist ratings={ratings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
