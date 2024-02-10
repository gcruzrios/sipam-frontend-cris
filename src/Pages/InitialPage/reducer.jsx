import {
    CHANGE_SOURCE_SELECTED,
    SAVE_BLOG_PREVIEW,
    SAVE_LISTADO_PAM,
    SAVE_PENDING_DOCS,
    SAVE_TABLE_STATE, SET_INITIAL_PAGE_READY
} from '@/store/model';

const initialState = {
    ready: false,
    blogPreview: null,
    listadoPam: [],
    pendingDocuments: [],
    sourceSelected: '1',
    tableState: {
        showColumnFilters: false,
        showGlobalFilter: true,
        density: 'compact',
        pagination: {
            pageIndex: 0,
            pageSize: 5
        }
    }
};

const InitialPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_BLOG_PREVIEW:
            state = {...state, blogPreview: action.payload};
            break;
        case SAVE_LISTADO_PAM:
            state = {...state, listadoPam: action.payload};
            break;
        case SAVE_PENDING_DOCS:
            state = {...state, pendingDocuments: action.payload};
            break;
        case CHANGE_SOURCE_SELECTED:
            state = {...state, sourceSelected: action.payload};
            break;
        case SAVE_TABLE_STATE:
            state = {...state, tableState: action.payload};
            break;
        case SET_INITIAL_PAGE_READY:
            state = {...state, ready: true};
            break;
        default:
            state = {...state};
            break;
    }
    return state;
};

export default InitialPageReducer;