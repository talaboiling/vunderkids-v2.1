import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import mathIcon from "../../assets/calculator.png";
import englishIcon from "../../assets/english.png";
import placeholderPfp from "../../assets/placehoder_pfp.png"; // Import the placeholder image
import cupicon from "../../assets/navCups.png";
import League from "./League";
import certbanner from "../../assets/certbanner.png";
import cert90 from "../../assets/90lessons.png";
import cert200 from "../../assets/200lessons.png";
import cert500 from "../../assets/500lessons.png";
import Loader from "../Loader";
import { fetchUserData, fetchCourses } from "../../utils/apiService";

const Lessons = () => {
  const [user, setUser] = useState({ first_name: "Ученик", last_name: "" }); // Default values
  const [courses, setCourses] = useState([]); // State to store courses
  const [loading, setLoading] = useState(true); // Add loading state
  const avatarUrl = user.avatar ? user.avatar : placeholderPfp; // Use placeholder if avatar is null

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const [userData, coursesData] = await Promise.all([
          fetchUserData(childId),
          fetchCourses(childId),
        ]);
        setUser(userData);
        setCourses(coursesData);
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
    <div className="rtdash certpage">
      <Sidebar />
      <div className="centralLessons">
        <Navdash
          starCount={user.stars}
          cupCount={user.cups}
          gradeNum={user.grade}
          notif={3}
        />
        <div className="mainContent">
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
              <div className="downloadCert">
                <p
                  style={{
                    margin: "0",
                    color: "white",
                    fontWeight: "600",
                    textWrap: "wrap",
                  }}
                >
                  Сертификаты можно скачать в электронном виде или же получить
                  по почте
                </p>
                <button className="orangeButton">СКАЧАТЬ</button>
                <form action="">
                  <input type="text" placeholder="Ваша почта" />
                  <button>Отправить</button>
                </form>
              </div>
            </div>
            <div className="sectCertificates">
              <div className="certbanner">
                <h2 className="defaultStyle" style={{fontSize:"xx-large", fontWeight:"800", color:"white", textAlign:"center", width:"250px"}}>
                  МОИ СЕРТИФИКАТЫ
                </h2>
              </div>
              <div className="achievements">
                <ul className="certificates">
                  <li className="certificate c90" id="">
                    <img src={cert90} alt="Сертификат" />
                    <p style={{ margin: "0", marginTop: "10px" }}>
                      Пройдите{" "}
                      <b style={{ fontWeight: "800", color: "#91DCB3" }}>90</b>{" "}
                      уроков
                    </p>
                  </li>
                  <li className="certificate c200" id="">
                    <img src={cert200} alt="Сертификат" />
                    <p style={{ margin: "0", marginTop: "10px" }}>
                      Пройдите{" "}
                      <b style={{ fontWeight: "800", color: "#FFD991" }}>200</b>{" "}
                      уроков
                    </p>
                  </li>
                  <li className="certificate c500">
                    <img src={cert500} alt="Сертификат" />
                    <p style={{ margin: "0", marginTop: "10px" }}>
                      Пройдите{" "}
                      <b style={{ fontWeight: "800", color: "#FF7763" }}>500</b>{" "}
                      уроков
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
