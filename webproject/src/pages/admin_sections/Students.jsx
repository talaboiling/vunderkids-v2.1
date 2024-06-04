import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Superside from "../admin_components/Superside";
import Studenttable from "../admin_components/Studentstable";
import "/src/superdash.css";

const Students = () => {
  const [searchItem, setSearchItem] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          "http://localhost:8000/api/all-students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    if (searchTerm === "") {
      setFilteredStudents(students);
    } else {
      const filteredItems = students.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filteredItems);
    }
  };

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain">
        <Link to={"/login"}>
          <button
            style={{
              border: "none",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#444",
              fontSize: "large",
              float: "right",
            }}
          >
            Выйти
          </button>
        </Link>

        <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
          Ученики
        </p>
        <div className="superCont">
          <div className="superSearch">
            <input
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder="Поиск ученика по имени или почте"
              style={{ border: "none", width: "50%" }}
            />
          </div>
          <div className="superTable">
            <Studenttable students={filteredStudents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
