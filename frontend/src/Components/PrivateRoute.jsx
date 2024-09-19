
import { Outlet,Navigate } from "react-router-dom";
import React from 'react';

const PrivateRoute = () => {
  return !!(localStorage.getItem("access_token") )? (
      <Outlet />
  ) : (
      <Navigate to="/login" />
  );
};

export default PrivateRoute;