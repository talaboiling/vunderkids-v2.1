import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Superside from "../admin_components/Superside.jsx"

const ClassDetails = () => {
  const { schoolId, classId } = useParams();
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    phone_number: "",
  });

  useEffect(() => {
    fetchStudents();
  }, [schoolId, classId]);

  const fetchStudents = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/schools/${schoolId}/classes/${classId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
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
        `http://localhost:8000/api/schools/${schoolId}/classes/${classId}/students/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        phone_number: "",
      });
      fetchStudents(); // Fetch the updated list of students
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain schoolCont">
        <h2>Идентификатор класса: {classId}</h2>
        {students.length === 0 ? (
          <div className="classList" style={{display:"flex", justifyContent:"center", alignItems:"center", marginBottom:"10px"}}>
            <p style={{color:"lightgray"}}>Пока нет учеников в этом классе.</p>
          </div>
          
        ) : (
          <ul className="classList">
          {students.map((student) => (
            <li key={student.id} className="classItem">
              <b>{student.user.first_name} {student.user.last_name}</b> <br /> {student.user.email} <br />
              {student.user.phone_number}
            </li>
          ))}
        </ul>
        )}
        
        <button onClick={() => setShowModal(true)} style={{border: "none",
                        borderRadius: "4px",
                        backgroundColor: "#509CDB",
                        fontSize: "large",
                        fontWeight: "600"
                      }}>Добавить ученика</button>

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
              <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">Имя</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                
                <label htmlFor="last_name">Фамилия</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                
                <label htmlFor="email">Email</label>
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
                
                <label htmlFor="gender">Пол</label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                
                <label htmlFor="phone_number">Телефон</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
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
                  Добавить
                </button>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
