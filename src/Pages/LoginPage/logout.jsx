import React from 'react';
import {Navigate, useLocation} from "react-router-dom";
import useAuth from "../../App/hooks/useAuth";
import * as R from 'ramda';


const Logout = () => {

    const {logout} = useAuth();

    const location = useLocation();

    React.useEffect(() => {
        logout();
    }, [logout]);

    const referer = window.document.referrer;

    const from = location.state?.from ? location.state?.from : R.not(R.includes('login',referer)) ? R.last(R.split(window.location.host, referer)) : "/";

    return(<Navigate
        replace={true}
        to="/login"
        state={{from}}
    />)
}

export default Logout;