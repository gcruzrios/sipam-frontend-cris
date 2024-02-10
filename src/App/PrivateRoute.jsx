import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from './hooks/useAuth';
import {includes} from 'ramda';

const PrivateRoute = ({Component, roles}) => {
    const {authed, role} = useAuth();
    const location = useLocation();

    return authed === true ? (
        includes(role, roles) ? (
            <Component/>
        ) : (
            <Navigate
                replace={true}
                to="/notFound"
                state={{from: `${location.pathname}${location.search}`}}
            />
        )) : (
        <Navigate
            replace={true}
            to="/login"
            state={{from: `${location.pathname}${location.search}`}}
        />);
};

PrivateRoute.propTypes = {
    Component: PropTypes.any,
};

export default PrivateRoute;
