import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logoImg from "/src/assets/logo_blue.png";

function Registration() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
        first_name: '',
        last_name: ''
    });

    const [responseMessage, setResponseMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone,
            first_name: formData.first_name,
            last_name: formData.last_name
        };

        try {
            const response = await fetch('http://localhost:8000/api/register-parent/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (response.ok) {
                setResponseMessage(`Success: ${data.message}`);
            } else {
                setResponseMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setResponseMessage(`Error: ${error.message}`);
        }
    };

    return (
        <>
            <div className="regacss">
                <div className="navBar" style={{ justifyContent: "space-around" }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <img className="navLogo" src={logoImg} alt="logo" style={{ marginRight: "100px" }} />
                    </Link>
                    <div className="excLogo">
                        <div className="navList">
                            <a href="/#oplatforme" className='navLink'>О ПЛАТФОРМЕ</a>
                            <a href="/#obuchenie" className='navLink'>ОБУЧЕНИЕ</a>
                            <a href="/#otzyvy" className='navLink'>ОТЗЫВЫ</a>
                            <a href="/#contakty" className='navLink'>КОНТАКТЫ</a>
                        </div>
                        <div className="navButton" style={{ marginLeft: "80px" }}>
                            <Link to={"/login"}><button>ВХОД</button></Link>
                        </div>
                    </div>
                </div>
                <div className="regPage">
                    <div className="regform">
                        <div className="formTitle">
                            <h3 className='form-h3'>Создать Аккаунт для Родителя</h3>
                            <Link to="/login" className='formLink'>У меня уже есть аккаунт</Link>
                        </div>
                        <form className='inputField' onSubmit={handleSubmit}>
                            <label htmlFor="first_name">Имя</label><br />
                            <input type="text" id="first_name" name="first_name" placeholder='Мақсат' value={formData.first_name} onChange={handleInputChange} required /><br />
                            
                            <label htmlFor="last_name">Фамилия</label><br />
                            <input type="text" id="last_name" name="last_name" placeholder='Бектұрғын' value={formData.last_name} onChange={handleInputChange} required /><br />
                            
                            <span className="gendemail">
                                <span>
                                    <label htmlFor="email">E-mail:</label><br />
                                    <input type="email" id="email" name="email" placeholder='maksat01@example.com' value={formData.email} onChange={handleInputChange} required style={{ width: '350px' }} />
                                </span>
                                <span>
                                    <label htmlFor="phone">Номер телефона</label><br />
                                    <input type="phone" id="phone" name="phone" placeholder='+7 (777) 1234567' value={formData.phone} onChange={handleInputChange} required style={{ width: '350px' }} />
                                </span>
                            </span>
                            <label htmlFor="password">Придумайте пароль:</label><br />
                            <input type="password" id="password" name="password" placeholder='********' value={formData.password} onChange={handleInputChange} required /><br />
                            <input type="submit" value="Регистрация" className='orangeButton' style={{ position: "relative", maxWidth: "200px", float:"left", marginTop: "25px", marginBottom: "0" }} />
                        </form>
                        {responseMessage && <p>{responseMessage}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Registration;
