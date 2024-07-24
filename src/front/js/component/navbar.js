import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  return (
    <nav className="navbar navbar-light custom-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand-link">
          <img 
            src="/homeai.jpg"
            alt="Compartments.com" 
            className="navbar-brand-image" 
          />
        </Link>
        <div className="ml-auto">
          <Link to="/demo">
            <button className="btn btn-primary">Check the Context in action</button>
          </Link>
        </div>
        <div className="ml-auto">
          <Link to="/categories">
            <button className="btn btn-primary">Categories</button>
          </Link>
          {!store.token ? (
            <>
              <div className="ml-auto">
                <Link to="/signin">
                  <button className="btn btn-primary">Sign In</button>
                </Link>
              </div>
              <div className="ml-auto">
                <Link to="/signup">
                  <button className="btn btn-primary">Sign Up</button>
                </Link>
              </div>
            </>
          ) : (
            <div className="ml-auto">
              <Link to="/signin">
                <button className="btn btn-primary" onClick={() => actions.logOut()}>Logout</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};