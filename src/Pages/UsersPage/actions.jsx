import {DELETE_USER, REFRESH_LISTADO_USUARIOS, SAVE_USERS_LIST} from '@/store/model';

export const saveUsersList = (usersList) => {
    return {
        type: SAVE_USERS_LIST,
        payload: usersList
    };
};

export const deleteUser = (user) => {
    return {
        type: DELETE_USER,
        payload: user
    };
};

export const refreshUserList = () => {
    return {
        type: REFRESH_LISTADO_USUARIOS,
    };
};