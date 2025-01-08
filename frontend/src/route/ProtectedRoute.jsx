import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element: Element, ...rest }) => {
    const navigate = useNavigate();
    const isAuth = useSelector((state) => state.auth.isAuthenticated);

    // if (isAuthenticated===false) {
    if (!isAuth) {

        return navigate("/login");
    }

    return <Element {...rest} />;
};

export default ProtectedRoute;
