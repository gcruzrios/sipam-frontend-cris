import {SAVE_LAWS_LIST} from '@/store/model';

const initialState = {
    lawsList: [],
};

const LawsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_LAWS_LIST:
            state = {...state, lawsList: action.payload};
            break;
        default:
            state = {...state};
            break;
    }
    return state;
};

export default LawsReducer;