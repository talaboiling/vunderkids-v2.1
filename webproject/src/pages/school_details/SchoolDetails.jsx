import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "../../superdash.css";

const SchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    grade: "",
    section: "",
  });

  useEffect(() => {
    fetchSchoolDetails();
    fetchClasses();
  }, [schoolId]);

  const fetchSchoolDetails = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/schools/${schoolId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchool(response.data);
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  };

  const fetchClasses = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/schools/${schoolId}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
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
      await axios.post(
        `http://localhost:8000/api/schools/${schoolId}/classes/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      setFormData({ grade: "", section: "" });
      fetchClasses(); // Fetch the updated list of classes
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  if (!school) {
    return <div>Loading...</div>;
  }

  return (
    <div className="spdash">
      <div className="superMain">
        <h2>{school.name}</h2>
        <p>Город: {school.city}</p>
        <p>Email: {school.email}</p>
        <p>Количество учеников: {school.student_number}</p>

        <h3>Классы</h3>
        <ul>
          {classes.map((classItem) => (
            <li
              key={classItem.id}
              onClick={() =>
                navigate(`/schools/${schoolId}/classes/${classItem.id}`)
              }
              className="classItem"
            >
              Класс: {classItem.grade} {classItem.section}
            </li>
          ))}
        </ul>
        <button onClick={() => setShowModal(true)}>Добавить класс</button>

        {showModal && (
          <dialog open className="modal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                }}
                onClick={() => setShowModal(false)}
              >
                <CloseIcon />
              </button>
              <br />
              <form
                onSubmit={handleSubmit}
                style={{ padding: "20px", fontSize: "large" }}
              >
                <label htmlFor="grade">Класс</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="section">Буква</label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <button
                  type="submit"
                  style={{ padding: "10px 20px", fontSize: "large" }}
                >
                  Добавить класс
                </button>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default SchoolDetails;
