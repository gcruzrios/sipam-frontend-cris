import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {desactivarUsuario, getListaUsuarios} from '@/server/api';
import {setLoading, showAlert} from '@/store/root/actions';
import {saveUsersList} from './actions';
import {DELETE_USER, REFRESH_LISTADO_USUARIOS} from '@/store/model';

function* deleteUserWatcher(action) {
    yield put(setLoading(true));
    const user = action.payload;
    const result = yield call(desactivarUsuario, user);
    if (result.outCodigo === '200') {
        yield put(showAlert({
            show: true,
            options: {
                icon: 'success',
                title: 'Se ha eliminado el usuario.'
            }
        }));
        yield call(fetchListaUsuarios);
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

function* deleteUserListener() {
    yield takeLatest(DELETE_USER, deleteUserWatcher);
}

function* fetchListaUsuarios() {
    const listaUsuarios = yield call(getListaUsuarios);
    yield put(saveUsersList(listaUsuarios?.Resultado || []));
}

function* refreshListaUsuariosListener() {
    yield takeLatest(REFRESH_LISTADO_USUARIOS, fetchListaUsuarios);
}

function* entryPoint() {
    yield put(setLoading(true));

    yield call(fetchListaUsuarios);

    yield all([
        fork(deleteUserListener),
        fork(refreshListaUsuariosListener)
    ]);

    yield put(setLoading(false));
}

const sagas = [entryPoint];

export default sagas;