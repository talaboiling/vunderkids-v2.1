import React from 'react';
import '../dashboard.css';
import logo from '../assets/NAV_LOGO.png';
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from './SidebarData';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); // Redirect to the homepage or login page
  };

  const goBack = () => {
    //need to use condition to check if this is a parent or a child
    navigate('/parent');
  };

  return (
    <div className='sidebar'>
      <Link to={"/"}>
        <img src={logo} alt="logo" className="dashsidelogo" />
      </Link>
      
      <div className="excSideLogo">
        <ul className='sideItems'>
          {SidebarData.map((item, index) => {
            return (
              <li 
                key={index} 
                className='linkbuttons'
                id={window.location.pathname === item.link ? "active" : ""}
                onClick={() => {
                  window.location.pathname = item.link
                }}
              >
                <Link to={item.link} className='linkbuttonVal'>
                  {item.icon}
                  <span className='linkTitle' id='linktit'>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <button className="exitButton" onClick={goBack}>Назад</button>
        <button className="exitButton" onClick={handleLogout} style={{backgroundColor:"rgb(204, 47, 47)"}}>Выйти из аккаунта</button>
      </div>
    </div>
  );
};

export default Sidebar;
