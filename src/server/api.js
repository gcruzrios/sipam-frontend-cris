import axios from 'axios';
import {getToken as getStoreToken} from '../App/hooks/useAuth';


const apiClient = axios.create({
    baseURL: '/api'
});

export const logoutHandler = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/logout') window.location = '/logout';
};

const throwServerError = (error) => {
    console.error(error);
    throw new Error('Unexpected Server Error');
};


apiClient.interceptors.response.use(
    response => {
        return response.data;
    }, error => {
        if (error.response.status === 401) {
            logoutHandler();
        }
        return throwServerError(error);
    }
);

/** UTILS **/

async function getHandleUnauthorized(url) {
    return await apiClient.get(
        url,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: getStoreToken()
            }
        });
}

async function postHandleUnauthorized(url, body) {
    return await apiClient.post(
        url,
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: getStoreToken()
            }
        });
}


/** FILL INITIAL DATA AND FILTERS **/
export const getModalidades = async () => {
    return getHandleUnauthorized('GetModalidades');
};

export const getEstadoCivil = async () => {
    return getHandleUnauthorized('GetEstadoCivil');
};

export const getNivelAcademico = async () => {
    return getHandleUnauthorized('GetNivelAcademico');
};

export const getProvincias = async () => {
    return getHandleUnauthorized('GetProvincias');
};

export const getCantones = async (provincia) => {
    const body = {
        pIdProvincia: provincia
    };
    return postHandleUnauthorized('GetCantonXProvincia', body);
};

export const getDistritos = async (canton) => {
    const body = {
        pIdCanton: canton
    };
    return postHandleUnauthorized('GetDistritosXCanton', body);
};

export const getGeneros = async () => {
    return getHandleUnauthorized('GetGenero');
};

export const getListaPermisos = async () => {
    return getHandleUnauthorized('GetListaPermisos');
};

export const getListaRoles = async () => {
    return getHandleUnauthorized('GetListaRoles');
};

export const getListaNacionalidades = async () => {
    return getHandleUnauthorized('GetNacionalidad');
};

export const getListaTiposId = async () => {
    return getHandleUnauthorized('GetTipoIdentificacion');
};

export const getListaTiposDocumento = () => {
    return getHandleUnauthorized('GetListaTipoDocumentos');
};

export const getTiposPobreza = () => {
    return getHandleUnauthorized('GetIndicePobreza');
};

export const getGradosDependencia = () => {
    return getHandleUnauthorized('GetGradoDependencia');
};

export const getProgramas = () => {
    return getHandleUnauthorized('GetListaProgramas');
};

export const getNotificaciones = (idRolUsuario, idOBSUsuario) => {
    const body = {
        idRolUsuario,
        idOBSUsuario
    };
    return postHandleUnauthorized('GetResultadoNotificaciones', body);
};

/** LOGIN METHODS **/

export const getToken = async () => {
    const postData = {
        'Username': 'c0n4p4n$AppSIPAMUser',
        'Password': 'c0n4p4n$AppSIPAMpass'
    };
    try {
        const response = await apiClient.post('/Authenticate', postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response || throwServerError(response);
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getUser = async (user, password, token) => {
    const body = {
        usuario: user,
        password
    };

    return await apiClient.post(
        '/GetUsuario',
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            }
        });

};

export const getUserData = (userId) => {
    const body = {
        idUsuario: userId
    };
    return postHandleUnauthorized('/GetUsuario_X_Id', body);
};

export const getBlogById = (blogId) => {
    const body = {
        blogId
    };
    try {
        return apiClient.post('/getBlogById', body, {
            headers: {
                'Content-Type': 'application/json',
                authorization: getStoreToken()
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

export const recoveryPassword = (body, token) => {
    return apiClient.post(
        '/RetablecerContrasennaTemporal',
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            }
        });
};

export const resetNewPassword = (body, token) => {
    return apiClient.post(
        '/RetablecerContrasennaNueva',
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            }
        });
};

/** FILL TABLES **/

export const getListaUsuarios = async () => {
    return getHandleUnauthorized('GetListaUsuario');
};

export const getListadoPAM = async ({cedula = '%', idModalidad}) => {
    const body = {
        cedula,
        idModalidad
    };
    return postHandleUnauthorized('GetConsultaPAM', body);
};

export const getPAM_PorIdOBS = async ({idOBS = '%', idModalidad}) => {
    const body = {
        idOBS,
        idModalidad
    };
    return postHandleUnauthorized('GetPAMPorIdOBS', body);
};

export const getLeyes = async () => {
    return getHandleUnauthorized('GetLeyes');
};

export const getListaOrganizaciones = async () => {
    return getHandleUnauthorized('GetOrganizaciones');
};

export const getListaDocumentos = (idOBS = '%') => {
    const body = {idOBS};
    return postHandleUnauthorized('GetListaDocumentos', body);
};


/** NEW RECORDS **/

export const registrarLey = async (data) => {
    const body = {
        numeroLey: data.numeroLey,
        nombreLey: data.nombreLey,
        porcentajeMonetario: data.porcentaje,
        estado: 'A'
    };
    return postHandleUnauthorized('/AgregarLeyes', body);
};

export const agregarOrganizacion = async (body) => {
    return postHandleUnauthorized('AgregarOrganizacion', body);
};

export const agregarUsuario = async (body) => {
    return postHandleUnauthorized('AgregarUsuario', body);
};

export const agregarDocumento = async (documento, idOBS) => {
    const body = {
        nombreDocumento: documento.fileName,
        idOBS,
        tipoDocumento: documento.fileType,
        archivoBase64: documento.base64File,
        fechaVencimiento: documento.expirationDate
    };
    return postHandleUnauthorized('AgregarDocumentos', body);
};

export const agregarPersonaPam = (body) => {
    return postHandleUnauthorized('AgregarDatosPersona_PAM', body);
};

export const agregarDatosPam = (body) => {
    return postHandleUnauthorized('AgregarDatosRegistro_PAM', body);
};

export const agregarRecurso = (body) => {
    return postHandleUnauthorized('AgregarRecurso', body);
};

export const getListaRecursos = () => {
    return getHandleUnauthorized('GetListaRecursos');
};

/** UPDATE RECORDS **/

export const modifyLey = async (body) => {
    return postHandleUnauthorized('/ModifLeyes', body);
};

export const modifyOrganizacion = async (org) => {
    return postHandleUnauthorized('ModifOrganizacion', org);
};

export const editarUsuario = async (body) => {
    return postHandleUnauthorized('ModifUsuario', body);
};

export const cambiarEstadoDocumento = async (body) => {
    return postHandleUnauthorized('ModifDocumentos', body);
};

export const modifPersonaPam = (body) => {
    return postHandleUnauthorized('ModifDatosPersona_PAM', body);
};

export const modifDatosPam = (body) => {
    return postHandleUnauthorized('ModifDatosRegistro_PAM', body);
};

/** GET RECORDS **/

export const getOrganizacionByCedula = async (id) => {
    const body = {
        cedula: id
    };
    return postHandleUnauthorized('GetObsPorCedula', body);
};

export const getOrganizacionById = async (id) => {
    const body = {
        idOBS: id
    };
    return postHandleUnauthorized('GetObsPorID', body);
};

export const getOrganizacionByCodigo = async (codigo) => {
    const body = {
        codigoInstitucion: codigo,
        idModalidad: '%'
    };
    return postHandleUnauthorized('GetObsPorCodigo', body);
};

export const getGeoPam = async () => {
    return getHandleUnauthorized('GetListadoPAMGEO');
};

export const getGeoObs = async () => {
    return getHandleUnauthorized('GetListadoOBSGEO');
};

export const getPersonaPadron = (cedula) => {
    const body = {cedula};
    return postHandleUnauthorized('GetPersonaPadron', body);

};

export const getPersonaDIMEX = (cedula) => {
    const body = {cedula};
    return postHandleUnauthorized('GetPersonaDIMEX', body);

};

export const getResultadoBusqueda = (parametro) => {
    const body = {parametro};
    return postHandleUnauthorized('GetResultadoBusqueda', body);

};


/** DEACTIVATE RECORD **/

export const desactivarLey = async (id) => {
    const body = {
        ID: id
    };
    return postHandleUnauthorized('EditarEstadoLeyes', body);
};

export const desactivarOrg = async (id) => {
    const body = {
        ID: id
    };
    return postHandleUnauthorized('EditarEstadoOrganizacion', body);
};

export const desactivarUsuario = async (id) => {
    const body = {
        ID: id
    };
    return postHandleUnauthorized('EditarEstadoUsuario', body);
};

export const cambiarEstadoPam = async (id, estado) => {
    const body = {
        ID: id,
        estado: estado
    };
    return postHandleUnauthorized('EditarEstadoPAM', body);
};