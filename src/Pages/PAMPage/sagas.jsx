import {call, put} from 'redux-saga/effects';
import {getListaUsuarios} from '@/server/api';
import {setLoading} from '@/store/root/actions';
import {saveUsersList} from './actions';

function* fetchListaUsuarios() {
    const listaUsuarios = yield call(getListaUsuarios);
    yield put(saveUsersList(listaUsuarios?.Resultado || []));
}

function* entryPoint() {
    yield put(setLoading(true));

    yield call(fetchListaUsuarios);

    yield put(setLoading(false));
}

const sagas = [entryPoint];

export default sagas;