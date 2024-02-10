import {SAVE_GEO_LIST} from '@/store/model';


export const saveGeolocationList = (geoList) => {
    return {
        type: SAVE_GEO_LIST,
        payload: geoList
    };
};