import { SAVE_USER } from '../model';

const initialState = {};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER: 
            state = action.payload;
            break;
        default:
            state = {...state};
            break;
    }
    return state;
};

export default UserReducer;