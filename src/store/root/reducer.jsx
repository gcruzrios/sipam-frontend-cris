import {
    SAVE_FILTER_VALUE,
    SAVE_FILTER_VALUE_ORGS,
    SAVE_ORGS_LIST,
    SET_APP_READY,
    SET_ESTADO_CIVIL,
    SET_GENEROS, SET_GRADOS_DEPENDENCIA,
    SET_LISTA_DOCUMENTOS,
    SET_LISTA_NACIONALIDADES,
    SET_LISTA_PERMISOS,
    SET_LISTA_ROLES,
    SET_LISTA_TIPOS_DOC,
    SET_LISTA_TIPOS_ID,
    SET_LOADING,
    SET_MODALIDADES,
    SET_NIVEL_ACADEMICO, SET_NOTIFICATIONS, SET_PROGRAMAS,
    SET_PROVINCIAS, SET_TIPOS_POBREZA,
    SHOW_ALERT
} from '../model';

const initialState = {
    isLoading: false,
    isAppReady: false,
    modalidades: [],
    estadoCivil: [],
    nivelAcademico: [],
    provincias: [],
    generos: [],
    permisos: [],
    roles: [],
    tiposIdentificacion: [],
    tiposPobreza: [],
    nacionalidades: [],
    tiposDocumento: [],
    listaDocumentos: [],
    notifications: [],
    gradosDependencia: [],
    orgsList: [],
    programas: [],
    filterValue: '',
    alert: {
        show: false,
        options: {}
    }
};


const RootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            state = {...state, isLoading: action.payload};
            break;
        case SET_APP_READY:
            state = {...state, isAppReady: action.payload};
            break;
        case SHOW_ALERT:
            state = {...state, alert: action.payload};
            break;
        case SET_MODALIDADES:
            state = {...state, modalidades: action.payload};
            break;
        case SET_ESTADO_CIVIL:
            state = {...state, estadoCivil: action.payload};
            break;
        case SET_NIVEL_ACADEMICO:
            state = {...state, nivelAcademico: action.payload};
            break;
        case SET_PROVINCIAS:
            state = {...state, provincias: action.payload};
            break;
        case SET_GENEROS:
            state = {...state, generos: action.payload};
            break;
        case SET_LISTA_PERMISOS:
            state = {...state, permisos: action.payload};
            break;
        case SET_LISTA_ROLES:
            state = {...state, roles: action.payload};
            break;
        case SET_LISTA_NACIONALIDADES:
            state = {...state, nacionalidades: action.payload};
            break;
        case SET_LISTA_TIPOS_ID:
            state = {...state, tiposIdentificacion: action.payload};
            break;
        case SET_TIPOS_POBREZA:
            state = {...state, tiposPobreza: action.payload};
            break;
        case SET_GRADOS_DEPENDENCIA:
            state = {...state, gradosDependencia: action.payload};
            break;
        case SET_LISTA_TIPOS_DOC:
            state = {...state, tiposDocumento: action.payload};
            break;
        case SET_LISTA_DOCUMENTOS:
            state = {...state, listaDocumentos: action.payload};
            break;
        case SET_PROGRAMAS:
            state = {...state, programas: action.payload};
            break;
        case SET_NOTIFICATIONS:
            state = {...state, notifications: action.payload};
            break
        case SAVE_ORGS_LIST:
            state = { ...state, orgsList: action.payload };
            break;
        case SAVE_FILTER_VALUE:
            state = { ...state, filterValue: action.payload };
            break;
        default:
            state = {...state};
            break;
    }
    return state;
};

export default RootReducer;