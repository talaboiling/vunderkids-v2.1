import "/src/dashboard.css";
import Sidebar from "../Sidebar";
import Navdash from "../Navdash";
import React, { useEffect, useRef, useState } from "react";
import { playGame, fetchUserData } from "../../utils/apiService";
import Timer from "../../components/Timer";
import { useTranslation } from "react-i18next";

const Games = () => {
  const { t } = useTranslation();

  const [user, setUser] = useState({ first_name: t("student"), last_name: "studentson", stars: 2, cups: 4, grade: 5, id: 1 }); // Default values
  // const [user, setUser] = useState({});
  const [isChild, setIsChild] = useState(false);
  // const [isChild, setIsChild] = useState(true);
  const [childId, setChildId] = useState("1");
  const [open, setOpen] = useState(false);
  const [gamePath, setGamePath] = useState("");
  const modalRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
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

  const loadData = async () => {
    try {
      const childId = localStorage.getItem("child_id");
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

  // const openGameWindow = async (path) => {
  //   try {
  //     const savedTime = localStorage.getItem('time');
  //
  //     if (!savedTime || parseInt(savedTime, 10) <= 0) {
  //       const childId = localStorage.getItem("child_id");
  //       let response;
  //
  //       if (childId) {
  //         console.log(childId);
  //         response = await playGame(childId);
  //       } else {
  //         response = await playGame();
  //       }
  //
  //       if (!response.is_enough) {
  //         alert(t('notEnoughStars'));
  //         return;
  //       }
  //
  //       await loadData();
  //       localStorage.setItem('time', 300);
  //     }
  //
  //     if (!open) {
  //       const updatedPath = path.endsWith('/') ? `${path}index.html` : path;
  //       setGamePath(updatedPath);
  //       setOpen(true);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert(error.message || "Something went wrong");
  //   }
  // };

  const openGameWindow = async (path) => {
    if (path === "/games/3ryad/index.html") {
      openLocalGame(path);
      return;
    }

    try {
      const savedTime = localStorage.getItem('time');

      if (!savedTime || parseInt(savedTime, 10) <= 0) {
        const childId = localStorage.getItem("child_id");
        let response;

        if (childId) {
          console.log(childId);
          response = await playGame(childId);
        } else {
          response = await playGame();
        }

        if (!response.is_enough) {
          alert(t('notEnoughStars'));
          return;
        }

        await loadData();
        localStorage.setItem('time', 300);
      }

      if (!open) {
        const updatedPath = path.endsWith('/') ? `${path}index.html` : path;
        setGamePath(updatedPath);
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  const openLocalGame = (path) => {
    const updatedPath = path.endsWith('/') ? `${path}index.html` : path;
    setGamePath(updatedPath);
    setOpen(true);
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
    <div className="rtdash rtrat gamesPage">
      <Sidebar isMenuOpen={isMenuOpen} />
      <div className="centralDash">
        <Navdash isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="game-div">
          <button onClick={() => openGameWindow("/games/3ryad/index.html")} className="game-button">Fantasy Forest</button>
          <button onClick={() => openGameWindow("/games/duckhunt/index.html")} className="game-button">Duck Hunt</button>
          <button onClick={() => openGameWindow("/games/gonki/index.html")} className="game-button">Gonki</button>
        </div>
        {open && (
        <dialog className="studmodal" ref={modalRef}>
          <div className="studmodal-content game-modal">
            <div className="modalHeader" style={{ marginBottom: "20px" }}>
              <h2 className="defaultStyle" style={{ color: "#666" }}>{t('game')}</h2>
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
                {t('close')}
              </button>
            </div>
            <iframe
              width="1000"
              height="500"
              src={`https://games.vunderkids.kz${gamePath}`}
              title="Game"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="game-iframe"
            ></iframe>
            {open && <Timer isActive={open} onTimeUp={handleTimeUp} />}
          </div>
        </dialog>
        )}
      </div>
    </div>
  );
};

export default Games;
