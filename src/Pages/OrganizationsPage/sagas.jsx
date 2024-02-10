import {put} from 'redux-saga/effects';
import {setLoading} from '@/store/root/actions';


function* entryPoint() {
    yield put(setLoading(true));

    yield put(setLoading(false));
}

const sagas = [entryPoint];

export default sagas;