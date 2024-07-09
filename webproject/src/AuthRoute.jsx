// AuthRoute.jsx
import { Navigate } from "react-router-dom";
import { getUserRole, isAuthenticated } from "./utils/authService.js";

const AuthRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();
  const authenticated = isAuthenticated();

//   console.log("AuthRoute authenticated:", authenticated); // Debugging log
//   console.log("AuthRoute role:", role); // Debugging log
//   console.log("AuthRoute allowedRoles:", allowedRoles); // Debugging log

  if (!authenticated) {
    console.log("User is not authenticated, redirecting to /login");
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    console.log(`User role ${role} is not allowed, redirecting to /login`);
    return <Navigate to="/login" />;
  }

  console.log("User is authenticated and authorized, rendering element");
  return element;
};

export default AuthRoute;
