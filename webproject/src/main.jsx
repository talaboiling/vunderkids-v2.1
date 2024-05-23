import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Registration from './pages/Registration.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Rating from './pages/dashboard_sections/Rating.jsx'
import Progress from './pages/dashboard_sections/Pprogress.jsx'
import Lessons from './pages/dashboard_sections/Lessons.jsx'
import Games from './pages/dashboard_sections/Games.jsx'
import Vhod from './pages/Login.jsx'


import{
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/registration", element: <Registration />},
  {path: "/dashboard", element: <Dashboard />},
  {path: "/dashboard/rating", element: <Rating />},
  {path: "/dashboard/progress", element: <Progress />},
  {path: "/dashboard/lessons", element: <Lessons/>},
  {path: "/dashboard/games", element: <Games/>},
  {path: "/login", element: <Vhod/>}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    <Route />
  </RouterProvider>
)
