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
import { fetchUserData, fetchWeeklyProgress } from "../../utils/apiService";
import Loader from "../Loader";

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
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const [userData, weeklyProgressData] = await Promise.all([
          fetchUserData(childId),
          fetchWeeklyProgress(childId),
        ]);

        setUser(userData);
        setWeeklyProgress(weeklyProgressData.weekly_progress);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading) {
    return <Loader></Loader>;
  }

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
