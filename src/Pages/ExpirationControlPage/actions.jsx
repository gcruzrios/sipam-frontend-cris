import {SET_EXPIRATION_PAGE_READY, SET_SELECTED_STATUS} from '@/store/model';

export const setPageReady = () => {
    return {
        type: SET_EXPIRATION_PAGE_READY,
    };
};

export const setSelectedStatus = (status) => {
    return {
        type: SET_SELECTED_STATUS,
        payload: status
    };
};
