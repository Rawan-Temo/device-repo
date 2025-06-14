import React, { useContext } from "react";
import { Context } from "../context/context";
import { Navigate, Outlet, useLocation } from "react-router";

const IsUser = (props) => {
  const { profile } = useContext(Context);
  const location = useLocation();
  return !profile?.is_superadmin ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={props.to || "login"} />
  );
};

export default IsUser;
