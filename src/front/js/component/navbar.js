import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { LoggedInNavbar } from "./loggedInNavbar";
import { NonLoggedInNavbar } from "./notLoggedInNavbar";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  const handleLogout = () => {
    actions.logOut();
  };

  return store.token ? (
    <LoggedInNavbar onLogout={handleLogout} />
  ) : (
    <NonLoggedInNavbar />
  );
};