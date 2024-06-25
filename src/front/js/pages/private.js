import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	console.log("useNavigate hook:", useNavigate);
	console.log("navigate function:", navigate);

	const isAuthenticated = () => {
		const token = sessionStorage.getItem('token');
		return token != null;
	}

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate('/signin')
		}
	}, [navigate])


	return (
		<div className="container">
			This is a private message
			<Link to="/Home">
				<button className="btn btn-primary">Back To Home</button>
			</Link>
		</div>
	);
};