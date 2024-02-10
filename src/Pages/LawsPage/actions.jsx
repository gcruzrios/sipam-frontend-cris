import {DELETE_LAW, SAVE_LAWS_LIST} from '@/store/model';


export const saveLawsList = (lawsList) => {
    return {
        type: SAVE_LAWS_LIST,
        payload: lawsList
    };
};



export const deleteLaw = (law) => {
    return {
        type: DELETE_LAW,
        payload: law
    };
}