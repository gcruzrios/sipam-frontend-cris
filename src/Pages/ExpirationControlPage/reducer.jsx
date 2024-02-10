import {SET_EXPIRATION_PAGE_READY, SET_SELECTED_STATUS} from '@/store/model';


const initialState = {
    ready: false,
    selectedStatus: "1"
};

const ExpirationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EXPIRATION_PAGE_READY:
            state = {...state, ready: true};
            break;
        case SET_SELECTED_STATUS:
            state = {...state, selectedStatus: action.payload};
            break;
        default:
            state = {...state};
            break;
    }
    return state;
};

export default ExpirationsReducer;