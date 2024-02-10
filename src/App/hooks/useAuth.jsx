import React, {useState, createContext} from 'react';
import Cookies from 'js-cookie';
import {USERID_STORE_KEY, TOKEN_STORE_KEY, ROLE_ADMIN, ROLE_ORG, USER_ROLE_STORE_KEY} from '@/store/model';

const authContext = createContext();
export const getToken = () => {
    return Cookies.get(TOKEN_STORE_KEY);
};

export const getUserId = () => {
    return Cookies.get(USERID_STORE_KEY);
};

export const getUserRole = () => {
    return JSON.parse(Cookies.get(USER_ROLE_STORE_KEY) || '{}');
};

const setUserRole = (role, persist, setRole) => {
    setRole(role);
    Cookies.set(USER_ROLE_STORE_KEY, JSON.stringify(role), persist ? {} : {expires: 1});
}

function useAuth() {
    const [token, setToken] = useState(getToken());
    const [authed, setAuthed] = useState(!!getToken());
    const [role, setRole] = useState(getUserRole);

    return {
        authed,
        token,
        login(userData, token, persist) {
            return new Promise((res) => {
                const rol = userData.rol;
                rol === '1' ? setUserRole(ROLE_ADMIN, persist, setRole) : setUserRole(ROLE_ORG, persist, setRole);
                const userId = userData.idUsuario;
                Cookies.set(TOKEN_STORE_KEY, token, persist ? {} : {expires: 1});
                setToken(token);
                Cookies.set(USERID_STORE_KEY, userId, persist ? {} : { expires: 1 });
                setAuthed(true);
                res();
            });
        },
        logout() {
            return new Promise((res) => {
                Cookies.remove(TOKEN_STORE_KEY);
                Cookies.remove(USERID_STORE_KEY);
                setToken(null);
                setAuthed(false);
                res();
            });
        },
        role
    };
}

export function AuthProvider({ children }) {
    const auth = useAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
    return React.useContext(authContext);
}