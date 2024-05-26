import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Index from "./pages/Index.jsx";
import User from "./pages/User.jsx";
import Rental from "./pages/Rental.jsx";
import Login from "./pages/Login.jsx";
import Calendar from "./pages/Calendar.jsx";
import Signup from "./pages/Signup.jsx";
import Logout from "./pages/Logout.jsx";
import Posts from "./pages/Posts.jsx";
import Dm from "./pages/Dm.jsx";
import Gadgets from "./pages/Gadgets.jsx";
import Schedule from "./pages/Schedule.jsx";
import  Search  from "./pages/Search.jsx";

import Temp from "./pages/TempAddGadget.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
    
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/logout",
    element: <Logout />
  },
  {
    path: "/rental",
    element: <Rental />
  },
  {
    path:"/calendar",
    element: <Calendar />
  },
  {
    path:"/temp",
    element: <Temp />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/posts/:postID",
    element: <Posts />
  },
  {
    path: "/dm",
    element: <Dm />
  },
  {
    path: "/dm/:dmGroupID",
    element: <Dm />
  },
  {
    path: "/:userID/gadgets",
    element: <Gadgets />
  },
  {
    path: "/:userID/schedule",
    element: <Schedule />
  },
  {
    path: "/search",
    element: <Search />
  },
  
  {
    path: "/:userID",
    element: <User />
  },

]
);