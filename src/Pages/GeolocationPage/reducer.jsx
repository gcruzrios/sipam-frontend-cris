import { SAVE_GEO_LIST } from '@/store/model';

const initialState = {
    geoList: [],
};

const GeolocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_GEO_LIST:
            state = { ...state, geoList: action.payload };
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default GeolocationReducer;