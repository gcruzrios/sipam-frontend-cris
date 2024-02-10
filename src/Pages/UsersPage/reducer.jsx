import {SAVE_USERS_LIST} from '@/store/model';

const initialState = {
    usersList: [],
};

const UsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USERS_LIST:
            state = { ...state, usersList: action.payload };
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default UsersReducer;