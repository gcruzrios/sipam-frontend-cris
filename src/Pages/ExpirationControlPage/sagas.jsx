import {put, select} from 'redux-saga/effects';
import {setPageReady} from './actions';

function* entryPoint() {
    const state = yield select();
    if (state.expirationsPage?.ready) {
        return;
    }

    yield put(setPageReady());
}

const sagas = [entryPoint];

export default sagas;