import {all, call, fork, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {getToken, getUserId, getUserRole} from '@/App/hooks/useAuth';
import {
    refreshListaDocumentos, saveOrganizationsList,
    setAppReady,
    setEstadoCivil,
    setGeneros, setGradosDependencia,
    setListaDocumentos,
    setListaNacionalidades, setListaNotificaciones,
    setListaPermisos,
    setListaRoles,
    setListaTiposDoc,
    setListaTiposId, setLoading,
    setModalidades,
    setNivelAcademico, setProgramas,
    setProvincias, setTiposPobreza,
    showAlert
} from './actions';
import {
    agregarDocumento, cambiarEstadoDocumento, desactivarOrg,
    getEstadoCivil,
    getGeneros, getGradosDependencia,
    getListaDocumentos,
    getListaNacionalidades, getListaOrganizaciones,
    getListaPermisos,
    getListaRoles,
    getListaTiposDocumento,
    getListaTiposId,
    getModalidades,
    getNivelAcademico, getNotificaciones, getProgramas,
    getProvincias, getTiposPobreza,
    getUserData
} from '@/server/api';
import {saveUser} from '../users/actions';
import * as R from 'ramda';
import {equals} from 'ramda';
import {
    ACEPTAR_DOCUMENTO, DELETE_ORG,
    LOAD_LISTA_DOCUMENTOS, LOAD_NOTIFICATIONS, LOAD_ORGS,
    RECHAZAR_DOCUMENTO, ROLE_ADMIN,
    ROLE_ORG,
    SAVE_USER,
    SEND_NEW_FILE
} from '../model';
import {delay} from 'lodash';
import {wait} from '@/utils/util';

function* loginWatcher() {
    yield call(getInitialData);
}

function* loginListener() {
    yield takeLatest(SAVE_USER, loginWatcher);
}

function* loadListaDocumentosWatcher() {
    const userRole = getUserRole();
    const idOBS = equals(userRole, ROLE_ORG) ? yield select(state => state.user.idOrganizacion) : '%';
    const listaDocumentosResult = yield call(getListaDocumentos, idOBS);
    const listaDocumentos = listaDocumentosResult ? listaDocumentosResult.Resultado : [];
    yield put(setListaDocumentos(listaDocumentos));
}

function* loadListaDocumentosListener() {
    yield takeLatest(LOAD_LISTA_DOCUMENTOS, loadListaDocumentosWatcher);
}

function* loadNotificationsWatcher() {
    const userRole = getUserRole();
    const idOBS = equals(userRole, ROLE_ORG) ? yield select(state => state.user.idOrganizacion) : '%';
    const notificacionesResult = yield call(getNotificaciones, userRole.id, idOBS);
    const notificaciones = notificacionesResult ? notificacionesResult.Resultado : [];
    yield put(setListaNotificaciones(notificaciones.map(n => ({
        title: n?.nombreDocumento,
        type: 'document'
    }))));
    yield call(wait, 300000);
    yield put({ type: LOAD_NOTIFICATIONS });
}

function* loadNotificationsListener() {
    yield takeLatest(LOAD_NOTIFICATIONS, loadNotificationsWatcher);
}

function* sendNewFileWorker(action) {
    const idOBS = yield select(state => state.user.idOrganizacion);
    const result = yield call(agregarDocumento, action.payload, idOBS);
    if (result && result.outMensaje === 'OK') {
        yield put(showAlert(
            {
                show: true,
                options: {
                    icon: 'success',
                    title: 'Se ha cargado el documento satisfactoriamente'
                }
            }
        ));
        yield put(refreshListaDocumentos());
    } else {
        yield put(showAlert(
            {
                show: true,
                options: {
                    icon: 'error',
                    title: 'Ha ocurrido un error al cargar el documento'
                }
            }
        ));
    }
}

function* sendNewFileListener() {
    yield takeEvery(SEND_NEW_FILE, sendNewFileWorker);
}

function* cambiarEstadoDocumentoWorker(action) {
    const estado = equals(action.type, ACEPTAR_DOCUMENTO) ? '2' : '3';
    const actionDone = equals(action.type, ACEPTAR_DOCUMENTO) ? 'acepta' : 'rechaza';
    const result = yield call(cambiarEstadoDocumento,{idDocumento: action.payload, estado: estado});
    if (result && result.outMensaje === 'OK') {
        yield put(showAlert(
            {
                show: true,
                options: {
                    icon: 'success',
                    title: `Se ha ${actionDone}do el documento.`
                }
            }
        ));
        yield put(refreshListaDocumentos());
    } else {
        yield put(showAlert(
            {
                show: true,
                options: {
                    icon: 'error',
                    title: `Ha ocurrido un error al ${actionDone}r el documento.`
                }
            }
        ));
    }

}

function* cambairEstadoDocumentoListener() {
    yield takeLatest([ACEPTAR_DOCUMENTO, RECHAZAR_DOCUMENTO], cambiarEstadoDocumentoWorker);
}



function* deleteOrgWatcher(action) {
    yield put(setLoading(true));
    const org = action.payload;
    const result = yield call(desactivarOrg, org);
    if (result.outCodigo === "200") {
        yield put(showAlert({
            show: true,
            options: {
                icon: 'success',
                title: 'Se ha eliminado la organización.'
            }
        }));
        yield call(fetchListaOrganizaciones);
    } else {
        yield put(showAlert({
            show: true,
            options: {
                icon: 'error',
                title: 'No se pudo realizar la acción'
            }
        }));
    }

    yield put(setLoading(false));

}

function*  deleteOrgListener() {
    yield takeLatest(DELETE_ORG, deleteOrgWatcher)
}

function* fetchListaOrganizaciones() {
    const listaOrgs = yield call(getListaOrganizaciones);
    yield put(saveOrganizationsList(listaOrgs?.Resultado || []));
}

function*  loadOrgsListener() {
    yield takeLatest(LOAD_ORGS, fetchListaOrganizaciones)
}

function* getInitialData() {
    yield put(setAppReady(false));
    const [
        modalidadesReult,
        estadoCivilResult,
        nivelAcademicoResult,
        provinciasResult,
        generosResult,
        listaPermisosResult,
        listaRolesResult,
        listaNacionalidadesResult,
        listaTiposIdResult,
        listaTiposDocResult,
        tiposPobrezaResult,
        gradosDependenciaResult,
        programasResult
    ] = yield all(
        [
            call(getModalidades),
            call(getEstadoCivil),
            call(getNivelAcademico),
            call(getProvincias),
            call(getGeneros),
            call(getListaPermisos),
            call(getListaRoles),
            call(getListaNacionalidades),
            call(getListaTiposId),
            call(getListaTiposDocumento),
            call(getTiposPobreza),
            call(getGradosDependencia),
            call(getProgramas),
        ]
    );

    const modalidades = modalidadesReult ? modalidadesReult.Resultado : [];
    yield put(setModalidades(modalidades));

    const estadoCivil = estadoCivilResult ? estadoCivilResult.Resultado : [];
    yield put(setEstadoCivil(estadoCivil));

    const nivelAcademico = nivelAcademicoResult ? nivelAcademicoResult.Resultado : [];
    yield put(setNivelAcademico(nivelAcademico));

    const provincias = provinciasResult ? provinciasResult.Resultado : [];
    yield put(setProvincias(provincias));

    const generos = generosResult ? generosResult.Resultado : [];
    yield put(setGeneros(generos));

    const listaPermisos = listaPermisosResult ? listaPermisosResult.Resultado : [];
    yield put(setListaPermisos(listaPermisos));

    const listaRoles = listaRolesResult ? listaRolesResult.Resultado : [];
    yield put(setListaRoles(listaRoles));

    const listaNacionalidades = listaNacionalidadesResult ? listaNacionalidadesResult.Resultado : [];
    yield put(setListaNacionalidades(listaNacionalidades));

    const listaTiposId = listaTiposIdResult ? listaTiposIdResult.Resultado : [];
    yield put(setListaTiposId(listaTiposId));

    const listaTiposDoc = listaTiposDocResult ? listaTiposDocResult.Resultado : [];
    yield put(setListaTiposDoc(listaTiposDoc));

    const tiposPobreza = tiposPobrezaResult ? tiposPobrezaResult.Resultado : [];
    yield put(setTiposPobreza(tiposPobreza));

    const gradosDependencia = gradosDependenciaResult ? gradosDependenciaResult.Resultado : [];
    yield put(setGradosDependencia(gradosDependencia));

    const programas = programasResult ? programasResult.Resultado : [];
    yield put(setProgramas(programas));

    yield call(loadListaDocumentosWatcher);

    yield put({ type: LOAD_NOTIFICATIONS });

    if (equals(getUserRole(), ROLE_ADMIN)) {
        yield call(fetchListaOrganizaciones);
    }

    yield put(setAppReady(true));
}

export default function* rootSaga() {
    const state = yield select();

    yield all([
        fork(loginListener),
        fork(loadListaDocumentosListener),
        fork(sendNewFileListener),
        fork(cambairEstadoDocumentoListener),
        fork(loadOrgsListener),
        fork(deleteOrgListener),
        fork(loadNotificationsListener)
    ]);

    const token = yield call(getToken);
    if (!token) {
        yield put(setAppReady(true));
        return;
    }

    const user = state.user;
    try {
        if (R.isEmpty(user)) {
            const userId = yield call(getUserId);
            const userDataRequest = yield call(getUserData, userId);
            const userData = userDataRequest.Resultado;
            yield put(saveUser(userData));
        } else {
            yield call(getInitialData);
        }
    } catch (err) {
        console.log(err);
        yield put(setAppReady(true));
    }


}