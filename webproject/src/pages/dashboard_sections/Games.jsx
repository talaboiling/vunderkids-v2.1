import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import { useEffect, useRef, useState } from "react";
import { 
  playGame,
  fetchUserData      
 } from "../../utils/apiService";
 import Timer from "../../components/Timer";
 import { useTranslation } from "react-i18next";

const Games = () => {
  const { t } = useTranslation();

  const [user, setUser] = useState({});
  const [isChild, setIsChild] = useState(false);
  const [childId, setChildId] = useState("");
  const [open, setOpen] = useState(false);
  const [gamePath, setGamePath] = useState("");
  const modalRef = useRef(null);

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
        if (open) {
            setOpen(false);
        }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        if (open) {
            setOpen(false);
        }
    };
  }, [open]);

  const fetchChildData = async () => {
    try {
      const updatedUserData = await fetchUserData(childId);
      setUser(updatedUserData);
    } catch (error) {
      console.error("Error fetching updated child data:", error);
    }
  };

  const openGameWindow = async (path) => {

    if (user.stars < 20) {
      alert(t ('notEnoughStars'));
      return;
    }

    if (!open) {
      const savedTime = localStorage.getItem('time');
      if (!savedTime || parseInt(savedTime, 10) <= 0) {
        playGame(childId);
        fetchChildData();
        localStorage.setItem('time', 300);
      }
      
      setGamePath(path);
      setOpen(true);
      // modalRef.current.setShowModal();
      
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
    setOpen(false);
  };

  const handleTimeUp = () => {
    closeModal();
    setOpen(false);
  };

  return (
    <div className="rtdash rtrat">
      <Sidebar />
      <div className="centralDash">
        <Navdash />
        <div class="game-div">
          <button onClick={() => openGameWindow("/src/pages/dashboard_sections/games/3ryad/index.html")} className="game-button">Fantasy Forest</button>
          <button onClick={() => openGameWindow("/src/pages/dashboard_sections/games/duckhunt/index.html")} className="game-button">Duck Hunt</button>
          <button onClick={() => openGameWindow("/src/pages/dashboard_sections/games/gonki/index.html")} className="game-button">Gonki</button>
        </div>
        {open && (
        <dialog className="studmodal" ref={modalRef}>
          <div className="studmodal-content game-modal">
            <div className="modalHeader" style={{ marginBottom: "20px" }}>
              <h2 className="defaultStyle" style={{ color: "#666" }}>{t ('game')}</h2>
              <button
                style={{
                  float: "right",
                  backgroundColor: "lightgray",
                  border: "none",
                  borderRadius: "10px",
                  color: "#666",
                }}
                onClick={closeModal}
              >
                {t ('close')}
              </button>
            </div>
            <iframe
              width="1000"
              height="500"
              src={gamePath}
              title="Game"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="game-iframe"
            ></iframe>
            {open && <Timer isActive={open} onTimeUp={handleTimeUp} />}
          </div>
        </dialog>)}
      </div>
    </div>
  );
};

export default Games;
