import {
    ACEPTAR_DOCUMENTO, DELETE_ORG,
    LOAD_LISTA_DOCUMENTOS, LOAD_ORGS, RECHAZAR_DOCUMENTO, SAVE_FILTER_VALUE, SAVE_FILTER_VALUE_ORGS, SAVE_ORGS_LIST,
    SEND_NEW_FILE,
    SET_APP_READY,
    SET_ESTADO_CIVIL,
    SET_GENEROS, SET_GRADOS_DEPENDENCIA, SET_LISTA_DOCUMENTOS, SET_LISTA_NACIONALIDADES,
    SET_LISTA_PERMISOS, SET_LISTA_ROLES, SET_LISTA_TIPOS_DOC, SET_LISTA_TIPOS_ID,
    SET_LOADING,
    SET_MODALIDADES,
    SET_NIVEL_ACADEMICO, SET_NOTIFICATIONS, SET_PROGRAMAS,
    SET_PROVINCIAS, SET_TIPOS_POBREZA,
    SHOW_ALERT
} from '../model';

export const setLoading = (loading) => {
    return {
        type: SET_LOADING,
        payload: loading
    };
};

export const setAppReady = (ready) => {
    return {
        type: SET_APP_READY,
        payload: ready
    };
};

export const showAlert = (alertOptions) => {
    return {
        type: SHOW_ALERT,
        payload: alertOptions
    };
};


/** INITIAL DATA **/

export const setModalidades = (modalidades) => {
    return {
        type: SET_MODALIDADES,
        payload: modalidades
    };
};

export const setEstadoCivil = (estadoCivil) => {
    return {
        type: SET_ESTADO_CIVIL,
        payload: estadoCivil
    };
};

export const setNivelAcademico = (nivelAcademico) => {
    return {
        type: SET_NIVEL_ACADEMICO,
        payload: nivelAcademico
    };
};

export const setProvincias = (provincias) => {
    return {
        type: SET_PROVINCIAS,
        payload: provincias
    };
};

export const setGeneros = (generos) => {
    return {
        type: SET_GENEROS,
        payload: generos
    };
};

export const setListaPermisos = (permisos) => {
    return {
        type: SET_LISTA_PERMISOS,
        payload: permisos
    };
};


export const setListaRoles = (roles) => {
    return {
        type: SET_LISTA_ROLES,
        payload: roles
    };
};

export const setListaNacionalidades = (nacionalidades) => {
    return {
        type: SET_LISTA_NACIONALIDADES,
        payload: nacionalidades
    };
};

export const setListaTiposId = (tipos) => {
    return {
        type: SET_LISTA_TIPOS_ID,
        payload: tipos
    };
};

export const setTiposPobreza = (tipos) => {
    return {
        type: SET_TIPOS_POBREZA,
        payload: tipos
    };
};

export const setGradosDependencia = (tipos) => {
    return {
        type: SET_GRADOS_DEPENDENCIA,
        payload: tipos
    };
};

export const setProgramas = (programas) => {
    return {
        type: SET_PROGRAMAS,
        payload: programas
    };
};

export const setListaTiposDoc = (tipos) => {
    return {
        type: SET_LISTA_TIPOS_DOC,
        payload: tipos
    };
};

export const setListaDocumentos = (documentos) => {
    return {
        type: SET_LISTA_DOCUMENTOS,
        payload: documentos
    };
};

export const setListaNotificaciones = (notificaciones) => {
    return {
        type: SET_NOTIFICATIONS,
        payload: notificaciones
    };
};

export const sendNewFile = (fileData) => {
    return {
        type: SEND_NEW_FILE,
        payload: fileData
    };
};

export const refreshListaDocumentos = () => {
    return {
        type: LOAD_LISTA_DOCUMENTOS
    };
}

export const rechazarDocumento = (idDocumento) => {
    return {
        type: RECHAZAR_DOCUMENTO,
        payload: idDocumento
    };
}

export const aceptarDocumento = (idDocumento) => {
    return {
        type: ACEPTAR_DOCUMENTO,
        payload: idDocumento
    };
}

export const saveOrganizationsList = (orgsList) => {
    return {
        type: SAVE_ORGS_LIST,
        payload: orgsList
    };
};

export const loadOrganizationsList = () => {
    return {
        type: LOAD_ORGS
    };
};

export const deleteOrg = (org) => {
    return {
        type: DELETE_ORG,
        payload: org
    };
}

export const saveFilterValue = (filterValue) => {
    return {
        type: SAVE_FILTER_VALUE,
        payload: filterValue
    };
};