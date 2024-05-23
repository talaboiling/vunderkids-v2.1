import React from 'react'
import '../dashboard.css'
import logo from '../assets/NAV_LOGO.png'
import {Link} from "react-router-dom";
import { SidebarData } from './SidebarData';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <img src={logo} alt="logo" className="dashsidelogo" />
      <div className="excSideLogo">
        <ul className='sideItems'>
          {SidebarData.map((item, index) => {
            return (
              <li 
              key={index} 
              className='linkbuttons'
              id={window.location.pathname == item.link ? "active" : ""}
              onClick={() => {
                window.location.pathname = item.link
              
              }}
              >
                <Link to={item.link} className='linkbuttonVal'>
                  {item.icon}
                  <span className='linkTitle' id='linktit'>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        
        <Link to="/">
          <button className="exitButton">Выйти</button>
        </Link>
        
      </div>
    </div>
  )
}

export default Sidebar