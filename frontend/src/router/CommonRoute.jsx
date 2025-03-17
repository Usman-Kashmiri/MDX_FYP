import React from "react";
import { useAuth } from "../hooks/auth";
import { Navigate } from "react-router-dom";
import Pusher from "pusher-js";

const CommonRoute = ({ Component }) => {
  const isAuthenticated = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  } else {
   

    return <Component />;
  }
};

export default CommonRoute;
