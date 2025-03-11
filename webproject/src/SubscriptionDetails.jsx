import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./assets/logo_blue.webp";
import i18next from "i18next";
import { getUserRole, isAuthenticated } from "./utils/authService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { slide as Menu } from "react-burger-menu";
import { fetchUserData, initiatePayment } from "./utils/apiService.js";
import { logout } from "./utils/authService";
const SubscriptionDetails = () => {
  const { t } = useTranslation();
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const role = getUserRole();
  const navigate = useNavigate();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [user, setUser] = useState();
  const [subscriptionExistsModal, setSubscriptionExistsModal] = useState(false);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://epay.homebank.kz/payform/payment-api.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);

        if (userData.has_subscription) {
          setHasSubscription(true);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubscription = async (planDuration) => {
    try {
      const paymentData = await initiatePayment(planDuration);
      console.log(paymentData);
      // Now you have payment data and token, you can proceed to call halyk.pay()
      const { payment, token } = paymentData;

      if (window.halyk && typeof window.halyk.pay === "function") {
        const paymentObject = {
          invoiceId: payment.invoice_id,
          invoiceIdAlt: payment.invoice_id_alt,
          backLink: "https://protosedu.kz/payment-successful/",
          failureBackLink: "https://protosedu.kz/payment-failed/",
          postLink:
            "https://api.protosedu.kz/api/payments/payment-confirmation/",
          failurePostLink:
            "https://api.protosedu.kz/api/payments/payment-confirmation/",
          language: "rus",
          description: "Оплата в интернет магазине",
          // accountId: "testuser1",
          terminal: "cf443ee5-789c-4743-8685-db9ed3c9a9f3",
          amount: payment.amount,
          data: `{\"statement\":{\"name\":\"${payment.email}\",\"invoiceID\":\"${payment.invoice_id}\"}}`,
          currency: payment.currency,
          name: payment.email.split("@")[0],
          email: payment.email,
          cardSave: false,
        };

        paymentObject.auth = token;
        window.halyk.pay(paymentObject);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error.message);
      if (error.response.status === 401) {
        navigate("/login");
      } else if (error.response.status === 400) {
        alert("У вас уже действует подписка: " + error.response.data.message);
      }
    }


  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="contain" style={{ height: "100vh" }}>
      <div className="navBar" style={{ boxShadow: "0 -5px 10px black" }}>
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img className="navLogo" src={logoImg} alt="logo" />
          </Link>
          {/* <span style={{ paddingRight: "10px" }}>
            <p className="rev">{t("ourContacts")}:</p>
            <p className="rev">+7 775 303 7432</p>
          </span> */}
        </div>
        <div className="excLogo">
          <div className="navList">
            <div className="navLink dropdown">
              <a href="#oplatforme" className="navLink">
                {t("aboutPlatform")}
              </a>
              <div className="friendly-box"></div>
              <div className="dropdownContent">
                <Link to="/oferty" className="dropdownLink">
                  {t("platformPage1")}
                </Link>
                <Link to="/users-terms-and-conditions" className="dropdownLink">
                  {t("platformPage2")}
                </Link>
              </div>
            </div>
            <a href="/#obuchenie" className="navLink">
              {t("education")}
            </a>
            <Link to="/ktp" className="navLink">КТП</Link>
            <a href="/#otzyvy" className="navLink">
              {t("reviews")}
            </a>
            <a href="/#contakty" className="navLink">
              {t("contacts")}
            </a>
            <a href="/subscription-details" className="navLink">
              {t("tariff")}
            </a>
          </div>
          <div className="navButton">
            <div className="langSelector">
              <button
                className="transBtn"
                onClick={() => i18next.changeLanguage("ru")}
              >
                РУС
              </button>
              <button
                className="transBtn"
                onClick={() => i18next.changeLanguage("kk")}
              >
                ҚАЗ
              </button>
            </div>
            <div className="navButton mob-right">
              {isLoggedIn ? (
                <div className="mob-right" style={{ display: "flex", flexDirection: "column" }}>
                  <Link
                    to={`${role === "superadmin"
                      ? "/admindashboard"
                      : role === "supervisor"
                        ? "/supervisor-dashboard"
                        : role === "parent"
                          ? "/parent"
                          : "/dashboard"
                      }`}
                    style={{ textDecoration: "none" }}
                  >
                    <button>{t("continue")}</button>
                  </Link>
                  <button className="orangeButton" onClick={handleLogout}>
                    {t("exit")}
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <button>{t("enter")}</button>
                  </Link>
                  <Link to="/registration">
                    <button className="orangeButton">{t("register")}</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="menuWrapper" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} style={{ color: "#00639E" }} />
        </div>
      </div>
      <Menu isOpen={isOpen} onStateChange={handleStateChange}>
        <a
          href="/#oplatforme"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("aboutPlatform")}
        </a>
        <a
          href="/#obuchenie"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("education")}
        </a>
        <a
          href="/#otzyvy"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("reviews")}
        </a>
        <a
          href="/#contakty"
          className="menu-item burger-contacts"
          onClick={() => setIsOpen(false)}
        >
          {t("contacts")}
        </a>
        <a
          href="/subscription-details"
          className="menu-item"
          onClick={() => setIsOpen(false)}
        >
          {t("tariff")}
        </a>
        <div className="langSelector burger-ln">
          <button className="" onClick={() => i18next.changeLanguage("ru")}>
            РУС
          </button>
          <button
            className=""
            style={{ marginLeft: "15px" }}
            onClick={() => i18next.changeLanguage("kk")}
          >
            ҚАЗ
          </button>
        </div>
        <div className="navButton">
          {isLoggedIn ? (
            <div>
              <Link
                to={`${role === "superadmin"
                  ? "/admindashboard"
                  : role === "supervisor"
                    ? "/supervisor-dashboard"
                    : role === "parent"
                      ? "/parent"
                      : "/dashboard"
                  }`}
                style={{ textDecoration: "none" }}
              >
                <button>{t("continue")}</button>
              </Link>
              <button className="orangeButton" onClick={handleLogout}>
                {t("exit")}
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="mob-right burger-login">
                <button>{t("enter")}</button>
              </Link>
              <Link to="/registration" className="orangeButtonWrapper">
                <button className="orangeButton" style={{ width: "100%" }}>
                  {t("register")}
                </button>
              </Link>
            </div>
          )}
        </div>
        <span>
          <p className="rev burger-rev">Наши контакты:</p>
          <p className="rev burger-rev">+7 775 303 7432</p>
        </span>
      </Menu>
      <div className="subscriptionBanners" style={{ marginTop: "40px" }}>
        <div className="certbanner" style={{ width: "500px" }}>
          <p
            className="defaultStyle"
            style={{
              fontSize: "xx-large",
              fontWeight: "800",
              color: "white",
              textAlign: "center",
              textWrap: "wrap",
              zIndex: "-1",
            }}
          >
            {t("premiumPlans")}
          </p>
        </div>
        <div className="subBanners">
          <div className="subBanner subban-1">
            <div className="subBanner-content">
              <p className="submonth">6 {t("months")}</p>
              <span>
                <strong
                  style={{
                    margin: "0",
                    fontSize: "xx-large",
                    fontWeight: "900",
                  }}
                >
                  9 990
                </strong>{" "}
                тг
              </span>
              <p
                style={{
                  width: "250px",
                  textAlign: "center",
                  color: "#444",
                  fontWeight: "500",
                  margin: "0",
                }}
              >
                {t("standardForStart")}
              </p>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    if (hasSubscription) {
                      setSubscriptionExistsModal(true);
                      return;
                    }
                    handleSubscription("6-month");
                  } else {
                    navigate("/login");
                  }
                }}
                className="payBtn"
              >
                {t("choose")}
              </button>
            </div>
          </div>
          <div className="subBanner subban-2">
            <div className="subBanner-content">
              <p className="submonth">12 {t("months")}</p>
              <span>
                <strong
                  style={{
                    margin: "0",
                    fontSize: "xx-large",
                    fontWeight: "900",
                  }}
                >
                  15 990
                </strong>{" "}
                тг
              </span>
              <p
                style={{
                  margin: "0",
                  width: "250px",
                  textAlign: "center",
                  color: "#444",
                  fontWeight: "500",
                }}
              >
                {t("standardForStart")}
              </p>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    if (hasSubscription) {
                      setSubscriptionExistsModal(true);
                      return;
                    }
                    handleSubscription("annual");
                  } else {
                    navigate("/login");
                  }
                }}
                className="payBtn"
              >
                {t("choose")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {subscriptionExistsModal && (
        <dialog className="studmodal" open>
          <div className="studmodal-content beautiful-modal">
            <h2 className="modal-title">{t("subscriptionExistsTitle")}</h2>
            <p className="modal-message">{t("subscriptionExistsMessage")}</p>
            <button className="modal-close-button" onClick={() => setSubscriptionExistsModal(false)}>
              {t("close")}
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default SubscriptionDetails;
