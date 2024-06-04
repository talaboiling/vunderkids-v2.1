import React, { useEffect, useState } from "react";
import axios from "axios";
import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import Profile from "../Profile";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Pprogress = () => {
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
          if (childId) {
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
        <Navdash />
        <div className="centralProg">
          <div style={{ width: "100%", height: "200px" }}>
            <Line data={data} options={options} />
          </div>
          <div className="progcalendar">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <Profile user={user} />
    </div>
  );
};

export default Pprogress;
