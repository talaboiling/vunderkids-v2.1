import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";

const Games = () => {
  return (
    <div className="rtdash">
      <Sidebar />
      <div className="centralDash">
        <Navdash />
      </div>
    </div>
  );
};

export default Games;
