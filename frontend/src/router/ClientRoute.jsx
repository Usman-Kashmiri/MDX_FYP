import React from "react";
import { UseGetRole, useAuth } from "../hooks/auth";
import { Navigate } from "react-router-dom";

const ClientRoute = ({ Component }) => {
  const isAuthenticated = useAuth();
  const role = UseGetRole();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  } else {
    if (role === "Client") {
      return <Component />;
    } else {
      return <Navigate to="/not-found" />;
    }
  }
};

export default ClientRoute;
