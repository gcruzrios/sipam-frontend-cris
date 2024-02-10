import { SAVE_USER } from '../model';

export const saveUser = (user) => {
    return {
        type: SAVE_USER,
        payload: user
    };
};

