import React, {useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {

	const { store, actions } = useContext(Context);

	
	// UPDATED
	
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Compartments.com</span>
				</Link>
				<div className="ml-auto">
					<Link to="/categories">
						<button className="btn btn-primary">categories</button>
					</Link>
				</div>
				<div className="ml-auto">
					{
					!store.token && <>
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
						</> || <div className="ml-auto">
							<Link to="/signin">
								<button className="btn btn-primary" onClick={() => actions.logOut()} >Logout</button>
							</Link>
						</div>
					}
				</div>
			</div>
		</nav>
	);
};