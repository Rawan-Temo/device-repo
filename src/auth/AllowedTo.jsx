import React, { useContext } from "react";
import { Context } from "../context/context";
import { Navigate, Outlet, useLocation } from "react-router";

const AllowedTo = (props) => {
  const { profile } = useContext(Context);
  const location = useLocation();
  return props.roles.includes(profile?.role) ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={props.to || "login"} />
  );
};

export default AllowedTo;
