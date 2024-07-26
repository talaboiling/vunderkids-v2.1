import React from "react";
import { Link } from "react-router-dom";
import lion_incorrect from "./assets/lion_incorrect.png";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <img src={lion_incorrect} alt="Lion Incorrect" style={styles.image} />
      <h1 style={styles.heading}>Ошибка 404</h1>
      <p style={styles.text}>Кажется страницы которую вы ищете нет</p>
      <Link to="/" style={styles.link}>
        <button style={styles.button}>Домой</button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  image: {
    width: "200px",
    height: "300px",
  },
  heading: {
    fontSize: "2.5rem",
    margin: "20px 0",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  link: {
    textDecoration: "none",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

styles.button["&:hover"] = {
  backgroundColor: "#0056b3",
};

export default NotFound;
