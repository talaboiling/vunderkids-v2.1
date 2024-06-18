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

import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Vhod /> },
  { path: "/registration", element: <Registration /> },
  { path: "/activate/:activation_token", element: <Activate /> },
  { path: "/parent", element: <Parentdash /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/rating", element: <Rating /> },
  { path: "/dashboard/progress", element: <Progress /> },
  { path: "/dashboard/lessons", element: <Lessons /> },
  { path: "/dashboard/games", element: <Games /> },
  { path: "/dashboard/courses/:courseId/lessons", element: <MathCourse /> },
  { path: "/admindashboard", element: <Superdash /> },
  { path: "/admindashboard/students", element: <Superstudents /> },
  { path: "/admindashboard/tasks", element: <Tasks /> },
  { path: "/schools/:schoolId", element: <SchoolDetails /> },
  { path: "/schools/:schoolId/classes/:classId", element: <ClassDetails /> },
  {
    path: "/admindashboard/tasks/courses/:courseId/sections/:sectionId",
    element: <TaskSection />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <Route />
  </RouterProvider>
);
