import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const isAuthenticated = () => {
		const token = sessionStorage.getItem('token');
		return token != null;
	};

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate('/signin');
		} else {
			navigate('/searchPage'); // Automatically navigate to searchPage if authenticated
		}
	}, [navigate]);

	return (
		<div>
			{isAuthenticated() ? (
				<h1>Welcome to Home.AI</h1>
			) : (
				<h1>Redirecting to login...</h1>
			)}
		</div>
	);
};