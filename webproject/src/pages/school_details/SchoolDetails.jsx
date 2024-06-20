import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Superside from "../admin_components/Superside.jsx";
import {
  addClasses,
  fetchClassesData,
  fetchSchoolData,
  assignSupervisor,
  deassignSupervisor, // Add these imports
} from "../../utils/apiService.js";

import Loader from "../Loader.jsx";

const SchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [supervisorModal, setSupervisorModal] = useState(false); // Modal for supervisor
  const [formData, setFormData] = useState({
    grade: "",
    section: "",
  });
  const [supervisorData, setSupervisorData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchSchoolDetails();
      await fetchClasses();
    };
    fetchData();
  }, [schoolId]);

  const fetchSchoolDetails = async () => {
    try {
      const schoolData = await fetchSchoolData(schoolId);
      setSchool(schoolData);
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const classesData = await fetchClassesData(schoolId);
      setClasses(classesData);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSupervisorFormChange = (e) => {
    const { name, value } = e.target;
    setSupervisorData({
      ...supervisorData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClasses(schoolId, formData);
      setShowModal(false);
      setFormData({ grade: "", section: "" });
      fetchClasses(); // Fetch the updated list of classes
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  const handleSupervisorSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignSupervisor(schoolId, supervisorData);
      setSupervisorModal(false);
      setSupervisorData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      });
      fetchSchoolDetails(); // Fetch the updated school details
    } catch (error) {
      console.error("Error assigning supervisor:", error);
    }
  };

  const handleDeassignSupervisor = async () => {
    try {
      await deassignSupervisor(schoolId);
      fetchSchoolDetails(); // Fetch the updated school details
    } catch (error) {
      console.error("Error deassigning supervisor:", error);
    }
  };

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain schoolCont">
        <h2>{school.name}</h2>
        <div className="schooldetails">
          <p className="defaultStyle">
            <b>Город:</b> {school.city}
          </p>
          <p className="defaultStyle">
            <b>Email:</b> {school.email}
          </p>
          <p className="defaultStyle">
            <b>Количество учеников:</b> {school.student_number}
          </p>
        </div>

        <h3>Классы</h3>
        {classes.length === 0 ? (
          <div
            className="classList"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <p style={{ color: "lightgray" }}>Классы еще не добавлены :(</p>
          </div>
        ) : (
          <ul className="classList">
            {classes.map((classItem) => (
              <li
                key={classItem.id}
                onClick={() =>
                  navigate(`/schools/${schoolId}/classes/${classItem.id}`)
                }
                className="classItem"
              >
                Класс:{" "}
                <b>
                  {classItem.grade} {classItem.section}
                </b>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => setShowModal(true)}
          style={{
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#509CDB",
            fontSize: "large",
            fontWeight: "600",
          }}
        >
          Добавить класс
        </button>

        <h3>Супервайзер</h3>
        {school.supervisor ? (
          <div className="supervisorDetails">
            <p className="defaultStyle">
              <b>Имя:</b> {school.supervisor.first_name}{" "}
              {school.supervisor.last_name}
            </p>
            <p className="defaultStyle">
              <b>Email:</b> {school.supervisor.email}
            </p>
            <p className="defaultStyle">
              <b>Телефон:</b> {school.supervisor.phone_number}
            </p>
            <button
              onClick={handleDeassignSupervisor}
              style={{
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#D9534F",
                fontSize: "large",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Удалить супервайзера
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSupervisorModal(true)}
            style={{
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#509CDB",
              fontSize: "large",
              fontWeight: "600",
            }}
          >
            Назначить супервайзера
          </button>
        )}

        {showModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setShowModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
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
                <button type="submit" className="superBtn">
                  Добавить
                </button>
              </form>
            </div>
          </dialog>
        )}

        {supervisorModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setSupervisorModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
              <br />
              <form
                onSubmit={handleSupervisorSubmit}
                style={{ padding: "20px", fontSize: "large" }}
              >
                <label htmlFor="first_name">Имя</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={supervisorData.first_name}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="last_name">Фамилия</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={supervisorData.last_name}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={supervisorData.email}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="phone_number">Телефон</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={supervisorData.phone_number}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <button type="submit" className="superBtn">
                  Назначить
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
