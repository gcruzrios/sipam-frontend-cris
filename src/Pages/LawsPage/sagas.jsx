import {call, fork, put, takeLatest} from 'redux-saga/effects';
import {desactivarLey, getLeyes} from '@/server/api';
import {setLoading, showAlert} from '@/store/root/actions';
import {saveLawsList} from './actions';
import {DELETE_LAW} from '@/store/model';

function* deleteLawWatcher(action) {
    yield put(setLoading(true));
    const law = action.payload;
    const result = yield call(desactivarLey, law);
    if (result.outCodigo === '200') {
        yield put(showAlert({
            show: true,
            options: {
                icon: 'success',
                title: 'Se ha eliminado la ley.'
            }
        }));
        yield call(fetchListaLeyes);
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

function* deleteLawListener() {
    yield takeLatest(DELETE_LAW, deleteLawWatcher);
}

function* fetchListaLeyes() {
    const listaLeyes = yield call(getLeyes);
    yield put(saveLawsList(listaLeyes?.Resultado || []));
}

function* entryPoint() {
    yield put(setLoading(true));

    yield call(fetchListaLeyes);

    yield fork(deleteLawListener);

    yield put(setLoading(false));
}

const sagas = [entryPoint];

export default sagas;