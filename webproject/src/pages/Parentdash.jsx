import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { FileUploader } from "react-drag-drop-files";
import logoImg from "../assets/logo_blue.webp";
import plusicon from "../assets/plus_icon.webp";
import pfplaceholder from "../assets/placehoder_pfp.webp";
import "/src/dashboard.css";
import staricon from "../assets/navStars.webp";
import cupicon from "../assets/navCups.webp";
import streak from "../assets/streak.webp";
import nostreak from "../assets/nostreak.webp";
import { logout } from "../utils/authService";
import {
  fetchUserData,
  fetchChildren,
  addChild,
  deleteChild,
} from "../utils/apiService";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";

const fileTypes = ["JPG", "PNG", "GIF"];

const Parentdash = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({ first_name: t("parent"), last_name: "" }); // Default values
  const [children, setChildren] = useState([]); // State to store children
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    grade: "0",
    birth_date: "",
    gender: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, childrenData] = await Promise.all([
          fetchUserData(),
          fetchChildren(),
        ]);

        setUser(userData);
        setChildren(childrenData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("grade", formData.grade);
    form.append("birth_date", formData.birth_date);
    form.append("gender", formData.gender);
    form.append("language", formData.language);
    if (file) {
      form.append("avatar", file);
    }

    try {
      await addChild(form);
      const childrenData = await fetchChildren(); // Fetch children data again to update the list
      setChildren(childrenData);
      setShowModal(false); // Close modal
    } catch (error) {
      console.error("Error adding child:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChild(childToDelete);
      const childrenData = await fetchChildren(); // Fetch children data again to update the list
      setChildren(childrenData);
      setShowDeleteModal(false); // Close delete modal
    } catch (error) {
      console.error("Error deleting child:", error);
    }
  };

  const handleNavigate = (childId) => {
    localStorage.setItem("child_id", childId);
    navigate(`/dashboard`);
  };

  const renderAddChildButtons = () => {
    const buttons = [];
    const remainingSlots = 3 - children.length;
    for (let i = 0; i < remainingSlots; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setShowModal(true)}
          className="addchildbtn"
        >
          <img src={plusicon} alt="add child" />
          <p style={{ fontSize: "x-large", fontWeight: "500" }}>
            {t("addChildButton")}
          </p>
        </button>
      );
    }
    return buttons;
  };

  if (loading) {
    <Loader></Loader>;
  }
  return (
    <div className="parentdash">
      <div className="navBar" style={{ margin: "0" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img className="navLogo" src={logoImg} alt="logo" />
        </Link>
        <div className="excLogo">
          <div className="mailname">{user.email}</div>
          <div className="navButton">
            <button onClick={handleLogout}>{t("exit")}</button>
          </div>
        </div>
      </div>

      <div className="addchildren">
        {children.map((child) => (
          <div key={child.id} className="childcard">
            <img
              src={child.avatar || pfplaceholder}
              alt="child avatar"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                borderRadius: "50%",
              }}
            />
            <p style={{ fontSize: "x-large" }}>
              {child.first_name} {child.last_name}
            </p>
            <div className="rndsh" style={{ marginBottom: "20px" }}>
              <p>
                {child.grade} {t("classLowercase")} ({child.language})
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
              <div
                className="lndsh"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <img src={staricon} alt="" className="starIcon" />
                <p>{child.stars}</p>
              </div>
              <div className="lndsh">
                <img src={cupicon} alt="" className="cupIcon" />
                <p>{child.cups}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
              <div className="lndsh">
                <p>
                  {t("lvl")}: {child.level}
                </p>
              </div>
              <div className="lndsh">
                <img
                  src={nostreak}
                  alt="streak"
                  style={{ width: "30px", height: "30px" }}
                />
                <p>{child.streak}</p>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "row", gap: "5rem" }}
            ></div>

            <div className="childcardBtns">
              <button
                onClick={() => handleNavigate(child.id)}
                className="orangeButton"
              >
                {t("goToPlatform")}
              </button>
              <button
                onClick={() => {
                  setChildToDelete(child.id);
                  setShowDeleteModal(true);
                }}
                style={{ backgroundColor: "rgb(204, 47, 47)" }}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}

        {renderAddChildButtons()}

        {showModal && (
          <dialog
            open
            className="modal supermodal"
            onClose={() => setShowModal(false)}
          >
            <div className="modal-content">
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  float: "right",
                  padding: "0",
                  margin: "0",
                }}
              >
                <CloseIcon sx={{ color: "grey" }} />
              </button>

              <form className="registrationInput" onSubmit={handleSubmit}>
                <div className="childavatar">
                  <img src={pfplaceholder} alt="pfp" />
                  <FileUploader
                    handleChange={handleFileChange}
                    name="file"
                    types={fileTypes}
                  />
                </div>
                <label htmlFor="first_name">{t("firstNameChild")}</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Мақсат"
                  required
                />
                <label htmlFor="last_name">{t("lastNameChild")}</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Бектұрғын"
                  required
                />
                <label htmlFor="birth_date">{t("birthDate")}</label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  required
                />
                <div className="gendgrade">
                  <label htmlFor="gender">{t("gender")}</label>
                  <label htmlFor="grade">{t("studClass")}</label>
                  <select
                    list="genders"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder={t("boy")}
                    required
                  >
                    <option value="">{t("Choose gender")}</option>
                    <option value="M">{t("boy")}</option>
                    <option value="F">{t("girl")}</option>
                    <option value="O">{t("other")}</option>
                  </select>
                  <select
                    list="grades"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder={t("preschool")}
                    required
                  >
                    <option value="0">{t("preschool")}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <label htmlFor="language">{t("Язык обучения")}</label>
                <select
                  name="language"
                  id="language"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  <option value="">{t("Язык обучения")}</option>
                  <option value="ru">Русский</option>
                  <option value="kz">Қазақша</option>
                </select>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <button type="submit">{t("addChildButton")}</button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {showDeleteModal && (
          <dialog
            open
            className="modal studmodal"
            onClose={() => setShowDeleteModal(false)}
          >
            <div className="modal-content">
              <p>{t("confirmDelete")}</p>
              <button onClick={handleDelete}>{t("yes")}</button>
              <button onClick={() => setShowDeleteModal(false)}>
                {t("no")}
              </button>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default Parentdash;
