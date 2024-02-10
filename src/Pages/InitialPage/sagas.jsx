import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {getBlogPreview} from '@/server/mockApi';
import {getToken, getUserRole} from '@/App/hooks/useAuth';
import {saveBlogPreview, saveListadoPam, setPageReady} from './actions';
import {setLoading, showAlert} from '@/store/root/actions';
import {cambiarEstadoPam, getListadoPAM, getListaOrganizaciones, getPAM_PorIdOBS} from '@/server/api';
import {CHANGE_SOURCE_SELECTED, CHANGE_PAM_STATUS, REFRESH_LISTADO_PAM, ROLE_ADMIN, ROLE_ORG} from '@/store/model';
import {equals} from 'ramda';


function* changePamStatusPamWatcher(action) {
    yield put(setLoading(true));
    const {pam, estado} = action.payload;
    const result = yield call(cambiarEstadoPam, pam, estado);
    if (result.outCodigo === '200') {
        yield put(showAlert({
            show: true,
            options: {
                icon: 'success',
                title: 'Se ha cambiado el estado del PAM.'
            }
        }));
        yield call(fetchListadoPam);
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

function* changePamStatusListener() {
    yield takeLatest(CHANGE_PAM_STATUS, changePamStatusPamWatcher);
}

function* fetchListadoPam() {
    const state = yield select();
    const idModalidad = state.initialPage.sourceSelected;
    const idOBS = state.user?.idOrganizacion;
    const listadoPam = yield call(getPAM_PorIdOBS, {
        idModalidad: idModalidad,
        idOBS: equals(idOBS, '0') ? '%' : idOBS
    });
    yield put(saveListadoPam(listadoPam?.Resultado || []));
}

function* sourceChangeListener() {
    yield takeLatest(CHANGE_SOURCE_SELECTED, fetchListadoPam);
}

function* refreshListadoPamListener() {
    yield takeLatest(REFRESH_LISTADO_PAM, fetchListadoPam)
}

function* entryPoint() {
    const state = yield select();
    if(state.initialPage?.ready) {
        return;
    }
    yield put(setLoading(true));
    const token = yield call(getToken);
    const fetchBlogPreview = call(getBlogPreview, token);

    const [
        blogPreview
    ] = yield all([
        fetchBlogPreview
    ]);

    const role = getUserRole();

    if (equals(role, ROLE_ORG)) {
        yield call(fetchListadoPam);
        yield fork(sourceChangeListener);
        yield fork(changePamStatusListener);
        yield fork(refreshListadoPamListener);
    }

    yield put(saveBlogPreview(blogPreview));

    yield put(setLoading(false));

    yield put(setPageReady());


}

const sagas = [entryPoint];

export default sagas;