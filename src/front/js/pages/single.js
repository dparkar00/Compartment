import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

export const Single = props => {
	const { store, actions } = useContext(Context);
	const params = useParams();
	// UPDATED


	return (
		<div className="jumbotron">
			<hr className="my-4" />
			{store.token ? store.token : 'no token'}
		</div>
	);
};

Single.propTypes = {
	match: PropTypes.object
};


// UPDATED