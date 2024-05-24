import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { FileUploader } from "react-drag-drop-files";
import logoImg from '../assets/logo_blue.png';
import plusicon from '../assets/plus_icon.png';
import pfplaceholder from '../assets/placehoder_pfp.png';
import '/src/dashboard.css';

const fileTypes = ["JPG", "PNG", "GIF"];

const Parentdash = () => {
  const [user, setUser] = useState({ first_name: 'Родитель', last_name: '' }); // Default values
  const [children, setChildren] = useState([]); // State to store children
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    grade: '',
    birth_date: '',
    gender: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); // Redirect to the homepage or login page
  };

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const response = await axios.get('http://localhost:8000/api/current-user', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }
  };

  const fetchChildren = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const response = await axios.get('http://localhost:8000/api/children', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setChildren(response.data);
      } catch (error) {
        console.error('Error fetching children:', error);
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchChildren();
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
    const accessToken = localStorage.getItem('access_token');
    const form = new FormData();
    form.append('first_name', formData.first_name);
    form.append('last_name', formData.last_name);
    form.append('grade', formData.grade);
    form.append('birth_date', formData.birth_date);
    form.append('gender', formData.gender);
    if (file) {
      form.append('avatar', file);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/children/', form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchChildren(); // Fetch children data again to update the list
      setShowModal(false); // Close modal
    } catch (error) {
      console.error('Error adding child:', error);
    }
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://localhost:8000/api/children/${childToDelete}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      fetchChildren(); // Fetch children data again to update the list
      setShowDeleteModal(false); // Close delete modal
    } catch (error) {
      console.error('Error deleting child:', error);
    }
  };

  const handleNavigate = (childId) => {
    localStorage.setItem('child_id', childId);
    navigate(`/dashboard?child_id=${childId}`);
  };

  const renderAddChildButtons = () => {
    const buttons = [];
    const remainingSlots = 3 - children.length;
    for (let i = 0; i < remainingSlots; i++) {
      buttons.push(
        <button key={i} onClick={() => setShowModal(true)} className="addchildbtn">
          <img src={plusicon} alt="add child" />
          <p style={{ fontSize: "x-large", fontWeight: "500" }}>Добавить ребенка</p>
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className='parentdash'>
      <div className="navBar" style={{ margin: "0" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img className="navLogo" src={logoImg} alt="logo" />
        </Link>
        <div className="excLogo">
          <div className="mailname">
            {user.email}
          </div>
          <div className="navButton">
            <button onClick={handleLogout}>ВЫЙТИ</button>
          </div>
        </div>
      </div>

      <div className="addchildren">
        {children.map(child => (
          <div key={child.id} className="childcard">
            <img src={child.avatar || pfplaceholder} alt="child avatar" />
            <p>{child.first_name} {child.last_name}</p>
            <p>Класс: {child.grade}</p>
            <p>Кубки: {child.cups}</p>
            <p>Звезды: {child.stars}</p>
            <p>Уровень: {child.level}</p>
            <p>Серия: {child.streak}</p>
            <button onClick={() => { setChildToDelete(child.id); setShowDeleteModal(true); }}>Удалить</button>
            <button onClick={() => handleNavigate(child.id)}>Перейти в платформу</button>
          </div>
        ))}

        {renderAddChildButtons()}

        {showModal && (
          <dialog open className="modal" onClose={() => setShowModal(false)}>
            <div className="modal-content">
              <button onClick={() => setShowModal(false)} style={{ border: "none", backgroundColor: "transparent", boxShadow: "none", float: "right", padding: "0", margin: "0" }}>
                <CloseIcon sx={{ color: "grey" }} />
              </button>

              <form className='inputField' onSubmit={handleSubmit}>
                <div className="childavatar">
                  <img src={pfplaceholder} alt="pfp" />
                  <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} />
                </div>
                <label htmlFor="first_name">Имя</label>
                <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                <br />
                <label htmlFor="last_name">Фамилия</label>
                <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                <br />
                <label htmlFor="birth_date">Дата Рождения</label>
                <input type="date" id="birth_date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} required />
                <br />
                <div className="gendgrade">
                  <span>
                    <label htmlFor="gender">Пол</label><br />
                    <input list="genders" id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required />
                    <datalist id="genders">
                      <option value="M">Мальчик</option>
                      <option value="F">Девочка</option>
                      <option value="O">Другое</option>
                    </datalist>
                  </span>
                  <span>
                    <label htmlFor="grade">Класс</label><br />
                    <input list="grades" id="grade" name="grade" value={formData.grade} onChange={handleInputChange} required />
                    <datalist id="grades">
                      <option value="Дошкольный" />
                      <option value="1" />
                      <option value="2" />
                      <option value="3" />
                    </datalist>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: "center", marginTop: "20px" }}>
                  <button type="submit">Добавить Ребенка</button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {showDeleteModal && (
          <dialog open className="modal" onClose={() => setShowDeleteModal(false)}>
            <div className="modal-content">
              <p>Вы уверены, что хотите удалить этого ребенка?</p>
              <button onClick={handleDelete}>Да</button>
              <button onClick={() => setShowDeleteModal(false)}>Нет</button>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default Parentdash;
