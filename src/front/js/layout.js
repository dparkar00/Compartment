import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import SearchPage from "./component/searchPage";

import { Category } from "./pages/categories";
import { CategoryFavorites } from "./pages/categoryFavorites";
import SignIn from "./component/signIn";
import SignUp from "./component/signUp";
import App from "./component/openAI";
import HomeSearch from "./component/homeSearch";
import MapComponent from "./component/map";

// ------ My imports ------------

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Category />} path="/categories" />
                        <Route element={<CategoryFavorites />} path="/categories/:category" />
                        <Route element={<Home />} path="/" />
                        <Route element={<MapComponent />} path="/map" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<SignUp />} path="/signUp" />
                        <Route element={<SignIn />} path="/signIn" />
                        <Route element={<App />} path="/cityfinder" />
                        <Route element={<HomeSearch />} path="/homesearch" />
                        <Route element={<SearchPage />} path="/searchPage" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);