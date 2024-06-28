import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";

const Games = () => {
  const openGameWindow = (path) => {
    window.open(path, "_blank", "width=800,height=600");
  }
  return (
    <div className="rtdash">
      <Sidebar />
      <div className="centralDash">
        <Navdash />
        <div>
          <button onClick={() => openGameWindow("/src/pages/dashboard_sections/games/3ryad/index.html")}>Open Game</button>
        </div>
      </div>
    </div>
  );
};

export default Games;
