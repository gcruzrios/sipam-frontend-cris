import { call, put } from 'redux-saga/effects';
import {getGeoPam, getGeoObs} from '@/server/api';
import {setLoading} from '@/store/root/actions';
import {saveGeolocationList} from './actions';
import {getUserRole} from '@/App/hooks/useAuth';
import {ROLE_ADMIN} from '@/store/model';
import * as R from 'ramda';

function* fetchGeolocationList() {
    const userRole = getUserRole();
    if (R.equals(userRole, ROLE_ADMIN)) {
        console.log("=>(sagas.jsx:12) userRole", userRole);
        const geolocationPamList =  yield call(getGeoPam);
        const geolocationObsList =  yield call(getGeoObs);
        const list = [geolocationPamList?.Resultado || [], geolocationObsList?.Resultado || []]
        yield put(saveGeolocationList(list));
    } else {
        const geolocationList =  yield call(getGeoPam);
        yield put(saveGeolocationList(geolocationList?.Resultado || []));
    }

}

function* entryPoint() {
    yield put(setLoading(true));

    yield call(fetchGeolocationList);

    yield put(setLoading(false));
}

const sagas = [entryPoint];

export default sagas;