import {
    CHANGE_SOURCE_SELECTED,
    CHANGE_PAM_STATUS, REFRESH_LISTADO_PAM,
    SAVE_BLOG_PREVIEW,
    SAVE_LISTADO_PAM,
    SAVE_PENDING_DOCS,
    SAVE_TABLE_STATE,
    SET_INITIAL_PAGE_READY
} from '@/store/model';

export const saveBlogPreview = (blogData) => {
    return {
        type: SAVE_BLOG_PREVIEW,
        payload: blogData
    };
};

export const saveListadoPam = (listadoPam) => {
    return {
        type: SAVE_LISTADO_PAM,
        payload: listadoPam
    };
};

export const refreshListadoPam = () => {
    return {
        type: REFRESH_LISTADO_PAM,
    };
};

export const savePendingDocs = (pendingDocuments) => {
    return {
        type: SAVE_PENDING_DOCS,
        payload: pendingDocuments
    };
};

export const changeSourceSelected = (sourceSelected) => {
    return {
        type: CHANGE_SOURCE_SELECTED,
        payload: sourceSelected
    };
};

export const changePamStatus = (pam, estado) => {
    return {
        type: CHANGE_PAM_STATUS,
        payload: {pam, estado}
    };
};

export const saveTableState = (state) => {
    return {
        type: SAVE_TABLE_STATE,
        payload: state
    };
};

export const setPageReady = () => {
    return {
        type: SET_INITIAL_PAGE_READY,
    };
};