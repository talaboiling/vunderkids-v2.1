import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Registration from "./pages/Registration.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Rating from "./pages/dashboard_sections/Rating.jsx";
import Progress from "./pages/dashboard_sections/Pprogress.jsx";
import Lessons from "./pages/dashboard_sections/Lessons.jsx";
import Games from "./pages/dashboard_sections/Games.jsx";
import Vhod from "./pages/Login.jsx";
import Activate from "./pages/Activate.jsx";
import Parentdash from "./pages/Parentdash.jsx";
import Superdash from "./pages/Superdash.jsx";
import Superstudents from "./pages/admin_sections/Students.jsx";
import Tasks from "./pages/admin_sections/Tasks.jsx";
import SchoolDetails from "./pages/school_details/SchoolDetails.jsx";
import ClassDetails from "./pages/school_details/ClassDetails.jsx";
import MathCourse from "./pages/courses/Math.jsx";
import TaskSection from "./pages/admin_sections/Tasksection.jsx";
import SupervisorDashboard from "./pages/SupervisorDashboard.jsx";
import AuthRoute from "./AuthRoute.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Renewal from "./pages/Renewal.jsx";
import ChangePassword from "./ChangePassword.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Vhod /> },
  { path: "/registration", element: <Registration /> },
  { path: "/activate/:activation_token", element: <Activate /> },
  { path: "/password-renewal", element: <Renewal />},
  { path: "/reset-password/:token", element: <ChangePassword />},
  {
    path: "/parent",
    element: (
      <AuthRoute element={<Parentdash />} allowedRoles={["parent"]} />
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AuthRoute element={<Dashboard />} allowedRoles={["student", "parent"]} />
    ),
  },
  {
    path: "/dashboard/rating",
    element: <AuthRoute element={<Rating />} allowedRoles={["student", "parent"]} />,
  },
  {
    path: "/dashboard/progress",
    element: <AuthRoute element={<Progress />} allowedRoles={["student", "parent"]} />,
  },
  {
    path: "/dashboard/lessons",
    element: <AuthRoute element={<Lessons />} allowedRoles={["student", "parent"]} />,
  },
  {
    path: "/dashboard/games",
    element: <AuthRoute element={<Games />} allowedRoles={["student", "parent"]} />,
  },
  {
    path: "/dashboard/courses/:courseId/lessons",
    element: <AuthRoute element={<MathCourse />} allowedRoles={["student", "parent"]} />,
  },
  {
    path: "/admindashboard",
    element: <AuthRoute element={<Superdash />} allowedRoles={["superadmin"]} />,
  },
  {
    path: "/admindashboard/students",
    element: <AuthRoute element={<Superstudents />} allowedRoles={["superadmin"]} />,
  },
  {
    path: "/admindashboard/tasks",
    element: <AuthRoute element={<Tasks />} allowedRoles={["superadmin"]} />,
  },
  {
    path: "/schools/:schoolId",
    element: <AuthRoute element={<SchoolDetails />} allowedRoles={["superadmin", "supervisor"]} />,
  },
  {
    path: "/schools/:schoolId/classes/:classId",
    element: <AuthRoute element={<ClassDetails />} allowedRoles={["superadmin", "supervisor"]} />,
  },
  {
    path: "/admindashboard/tasks/courses/:courseId/sections/:sectionId",
    element: <AuthRoute element={<TaskSection />} allowedRoles={["superadmin"]} />,
  },
  {
    path: "/supervisor-dashboard",
    element: <AuthRoute element={<SupervisorDashboard />} allowedRoles={["supervisor"]} />,
  },
  {
    path: "/subscriptions",
    element: <AuthRoute element={<Subscriptions />} allowedRoles={["parent"]}/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
