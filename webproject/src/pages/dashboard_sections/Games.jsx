import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import { useEffect, useRef, useState } from "react";
import { 
  playGame,
  fetchUserData      
 } from "../../utils/apiService";
 import Timer from "../../components/Timer";

const Games = () => {

  const [user, setUser] = useState({});
  const [isChild, setIsChild] = useState(false);
  const [childId, setChildId] = useState("");
  const [open, setOpen] = useState(false);
  const externalWindow = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const childId = localStorage.getItem("childId");
        let userData;
        if (childId) {
          userData = await fetchUserData(childId);
          setIsChild(true);
          setChildId(childId);

        } else {
          userData = await fetchUserData();
        }
        setUser(userData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
        if (externalWindow.current) {
            externalWindow.current.close();
        }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        if (externalWindow.current) {
            externalWindow.current.close();
        }
    };
  }, []);

  const fetchChildData = async () => {
    try {
      const updatedUserData = await fetchUserData(childId);
      setUser(updatedUserData);
    } catch (error) {
      console.error("Error fetching updated child data:", error);
    }
  };

  const openGameWindow = async (path) => {

    if (!open) {
      const savedTime = localStorage.getItem('time');
      if (!savedTime || parseInt(savedTime, 10) <= 0) {
        localStorage.setItem('time', 600);
      }
      externalWindow.current = window.open(path, "_blank", "width=800,height=600");
      setOpen(true);
      
      const ifWindowClosed = () => {
        if (externalWindow.current && externalWindow.current.closed) {
          setOpen(false);
          console.log("Game window closed");
        } else {
          setTimeout(ifWindowClosed, 10);
        }
      };

      ifWindowClosed();
    }
  };

  const handleTimeUp = () => {
    if (externalWindow.current) {
      externalWindow.current.close();
    }
    setOpen(false);
    playGame(childId);
    fetchChildData();
  };

  return (
    <div className="rtdash">
      <Sidebar />
      <div className="centralDash">
        <Navdash />
        <div>
          <button onClick={() => openGameWindow("/src/pages/dashboard_sections/games/3ryad/index.html")}>Open Game</button>
          {open && <Timer isActive={open} onTimeUp={handleTimeUp}/>}
        </div>
      </div>
    </div>
  );
};

export default Games;
