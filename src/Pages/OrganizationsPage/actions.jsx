import {SAVE_FILTER_VALUE_ORGS} from '@/store/model';


export const saveFilterValue = (filterValue) => {
    return {
        type: SAVE_FILTER_VALUE_ORGS,
        payload: filterValue
    };
};