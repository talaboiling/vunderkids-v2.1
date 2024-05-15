import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Heaven from './pages/Heaven.jsx'
import Hell from './pages/Hell.jsx'
import Registration from './pages/Registration.jsx'

import{
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/heaven", element: <Heaven />},
  {path: "/hell", element: <Hell />},
  {path: "/registration", element: <Registration />},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    <Route />
  </RouterProvider>
)
