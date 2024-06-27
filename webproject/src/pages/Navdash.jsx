import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import staricon from "../assets/navStars.png";
import cupicon from "../assets/navCups.png";
import { fetchUserData } from "../utils/apiService"; // Import the fetch function
import Loader from "./Loader";

const Navdash = (props) => {
  const [user, setUser] = useState({ first_name: "Ученик", last_name: "" }); // Default values

  useEffect(() => {
    const fetchUser = async () => {
      const childId = localStorage.getItem("child_id");
      try {
        const userData = await fetchUserData(childId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="navdashboard">
      <div className="lndsh starCount">
        <img src={staricon} alt="stars" className="starIcon" />
        {user.stars || props.starCount}
      </div>
      <div className="lndsh cupCount">
        <img src={cupicon} alt="cups" className="cupIcon" />
        {user.cups || props.cupCount}
      </div>
      <div className="rndsh gradeNum">{user.grade || props.gradeNum} Класс</div>
      <div className="rndsh langSelect">
        <div className="button b2" id="button-10">
          <input type="checkbox" className="checkbox" />
          <div className="knobs">
            <span>ҚАЗ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Navdash.propTypes = {
  starCount: PropTypes.number,
  cupCount: PropTypes.number,
  gradeNum: PropTypes.number,
  langSelect: PropTypes.bool,
  notif: PropTypes.number,
};

Navdash.defaultProps = {
  starCount: 0,
  cupCount: 0,
  gradeNum: 1,
  langSelect: false,
  notif: 0,
};

export default Navdash;
