// Superdash.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Superside from "./admin_components/Superside.jsx";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "/src/superdash.css";

const Superdash = () => {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      await axios.post("http://localhost:8000/api/schools/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowModal(false);
      setFormData({ name: "", city: "", email: "" });
      fetchSchools(); // Fetch the updated list of schools
    } catch (error) {
      console.error("Error adding school:", error);
    }
  };

  const handleSchoolClick = (schoolId) => {
    navigate(`/schools/${schoolId}`);
  };

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain">
        <button className="superBtn" onClick={handleLogout} style={{float: "right"}}>Выйти</button>
        <p style={{ fontSize: "xx-large", fontWeight: "500", color: "#666" }}>
          Школы
        </p>
        <div className="addschool">
          <button
            onClick={() => setShowModal(true)}
            style={{border: "none",
            borderRadius: "4px",
            backgroundColor: "#509CDB",
            fontSize: "large",
            fontWeight: "600"}}
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
              style={{ border: "none", width: "50%", fontSize: "large" }}
            />
          </div>
          <ul className="schoolsList">
            {filteredSchools.map((school) => (
              <li
                key={school.id}
                className="schoolItem"
                onClick={() => handleSchoolClick(school.id)}
              >
                <p
                  style={{
                    margin: "0",
                    marginBottom: "10px",
                    fontSize: "large",
                  }}
                >
                  {school.name}
                </p>
                <p style={{ margin: "0" }}>{school.city}</p>
                <p
                  style={{
                    margin: "0",
                    fontWeight: "500",
                    fontSize: "large",
                  }}
                >
                  Количество учеников: {school.student_number}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <dialog open className="modal supermodal">
          <div className="modal-content">
            <button
              style={{
                border: "none",
                float: "right",
                backgroundColor: "transparent",
                boxShadow:"none"
              }}
              onClick={() => setShowModal(false)}
            >
              <CloseIcon sx={{color:"gray"}}/>
            </button>
            <br />
            <h2 style={{animation:"none", color:"#4F4F4F", fontSize:"x-large"}}>Добавить школу</h2>
            <form
              onSubmit={handleSubmit}
              style={{ padding: "20px", fontSize: "large" }}
            >
              <label htmlFor="name">Название школы</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                style={{ width: "100%", padding: "10px", fontSize: "large" }}
              />
              <br />
              <br />
              <label htmlFor="city">Город</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                required
                style={{ width: "100%", padding: "10px", fontSize: "large" }}
              />
              <br />
              <br />
              <label htmlFor="email">Адрес электронной почты</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                style={{ width: "100%", padding: "10px", fontSize: "large" }}
              />
              <br />
              <br />
              <button
                type="submit"
                className="superBtn"
              >
                Дальше
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Superdash;
