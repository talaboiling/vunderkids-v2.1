import React, { useEffect, useState } from "react";
import axios from "axios";
import Superside from "./admin_components/Superside.jsx";
import { useNavigate } from "react-router-dom";
import "/src/superdash.css";

const Superdash = () => {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("http://localhost:8000/api/schools/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchools(response.data);
        setFilteredSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = schools.filter((school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredSchools(filteredItems);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // Redirect to the homepage or login page
  };

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain">
        <button
          style={{
            border: "none",
            borderRadius: "4px",
            backgroundColor: "transparent",
            color: "#444",
            fontSize: "large",
            float: "right",
          }}
          onClick={handleLogout}
        >
          Выйти
        </button>
        <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
          Школы
        </p>
        <div className="addschool">
          <button
            style={{
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#509CDB",
              fontSize: "large",
              fontWeight: "600",
            }}
          >
            Добавить школу
          </button>
        </div>
        <div className="superCont">
          <div className="superSearch">
            <input
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder="Поиск школы по названию или ID"
              style={{ border: "none", width: "50%" }}
            />
          </div>
          <ul className="schoolsList">
            {filteredSchools.map((school) => (
              <li key={school.id} className="schoolItem">
                <p style={{ margin: "0", marginBottom: "10px" }}>
                  {school.name}
                </p>
                {school.city} <br />
                <p
                  style={{ margin: "0", marginTop: "30px", fontWeight: "500" }}
                >
                  Количество учеников: {school.student_number}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Superdash;
