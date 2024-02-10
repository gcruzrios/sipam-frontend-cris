import {SAVE_FILTER_VALUE_ORGS, SAVE_ORGS_LIST} from '@/store/model';

const initialState = {
    filterValue: ''
};

const OrgsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_FILTER_VALUE_ORGS:
            state = { ...state, filterValue: action.payload };
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default OrgsReducer;