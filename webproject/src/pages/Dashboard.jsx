import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "/src/dashboard.css";
import Sidebar from "./Sidebar";
import Navdash from "./Navdash";
import Profile from "./Profile";
import lionimg from "../assets/lion_hellocont.png";
import mathIcon from "../assets/calculator.png";
import englishIcon from "../assets/english.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [user, setUser] = useState({ first_name: "Ученик", last_name: "" }); // Default values
  const [courses, setCourses] = useState([]); // State to store courses
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_token");
      const childId = localStorage.getItem("child_id");
      if (accessToken) {
        try {
          const userEndpoint = childId
            ? `http://localhost:8000/api/children/${childId}`
            : "http://localhost:8000/api/current-user";
          const response = await axios.get(userEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (localStorage.getItem("child_id")) {
            setUser(response.data);
          } else {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchCourses = async () => {
      const accessToken = localStorage.getItem("access_token");
      const childId = localStorage.getItem("child_id");
      if (accessToken) {
        try {
          const coursesEndpoint = childId
            ? `http://localhost:8000/api/courses?child_id=${childId}`
            : "http://localhost:8000/api/courses";
          const response = await axios.get(coursesEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setCourses(response.data);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };

    const fetchWeeklyProgress = async () => {
      const accessToken = localStorage.getItem("access_token");
      const childId = localStorage.getItem("child_id");
      if (accessToken) {
        try {
          const progressEndpoint = childId
            ? `http://localhost:8000/api/progress/weekly?child_id=${childId}`
            : "http://localhost:8000/api/progress/weekly";
          const response = await axios.get(progressEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setWeeklyProgress(response.data.weekly_progress);
        } catch (error) {
          console.error("Error fetching weekly progress:", error);
        }
      }
    };

    fetchUserData();
    fetchCourses();
    fetchWeeklyProgress();
  }, []);

  const daysInRussian = {
    Monday: "Пон",
    Tuesday: "Вто",
    Wednesday: "Сре",
    Thursday: "Чет",
    Friday: "Пят",
    Saturday: "Суб",
    Sunday: "Вос",
  };

  const data = {
    labels: weeklyProgress.map((day) => daysInRussian[day.day] || day.day),
    datasets: [
      {
        label: "Кубки",
        data: weeklyProgress.map((day) => day.cups),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Кубки",
          font: {
            size: 20,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="rtdash">
      <Sidebar />
      <div className="centralDash">
        <Navdash
          starCount={user.stars}
          cupCount={user.cups}
          gradeNum={user.grade}
          notif={3}
        />
        <div className="mainContent">
          <h2 style={{ color: "#22222244" }}>Главная</h2>
          <div className="helloContent">
            <span className="helloCont">
              <p
                style={{
                  fontWeight: "500",
                  fontSize: "xx-large",
                  color: "#222222ef",
                  margin: "0",
                  marginBottom: "15px",
                }}
              >
                Привет, <strong>{user.first_name}</strong>
              </p>
              <p
                style={{
                  fontWeight: "500",
                  color: "#2222229f",
                  maxWidth: "70%",
                  margin: "0",
                }}
              >
                Делай сегодня то, что другие не хотят - завтра будешь жить так,
                как другие не могут
              </p>
            </span>
            <img
              src={lionimg}
              alt="mascot"
              style={{
                position: "absolute",
                top: "-50px",
                left: "70%",
                scale: "1.2",
              }}
            />
          </div>

          <h3
            style={{ color: "black", fontWeight: "700", fontSize: "x-large" }}
          >
            Мои курсы
          </h3>
          <div className="coursesCards">
            {courses.map((course) => (
              <div className="courseItem" key={course.id}>
                <div className="courseItemLeft">
                  <p style={{ margin: "0" }}>{course.name}</p>
                  <progress value={course.percentage_completed / 100} />
                  <Link to={`/dashboard/lessons/${course.id}`}>
                    <button
                      style={{
                        backgroundColor: "#F8753D",
                        fontWeight: "550",
                        fontSize: "large",
                        borderColor: "#FFB99C",
                        boxShadow: "none",
                      }}
                    >
                      Начать
                    </button>
                  </Link>
                </div>
                <img
                  src={course.name === "Математика" ? mathIcon : englishIcon}
                  alt={course.name}
                  style={{
                    backgroundColor: "#F8753D",
                    border: "1px solid black",
                    borderRadius: "21px",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="progressChart">
            <div style={{ width: "100%", height: "200px" }}>
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
      <Profile user={user} />
    </div>
  );
};

export default Dashboard;
