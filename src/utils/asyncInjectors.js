import {createReducers} from '@/store/store';


export function injectAsyncReducer(store) {
    return function injectReducer(name, asyncReducer) {
        store.asyncReducers[name] = asyncReducer;
        store.replaceReducer(createReducers(store.asyncReducers));
    };
}

export function injectAsyncSagas(sagaMiddleware) {
    return function injectSagas(sagas) {
        sagas.map(sagaMiddleware.run);
    };
}

export function getAsyncInjectors(store, sagaMiddleware) {
    return {
        injectReducer: injectAsyncReducer(store),
        injectSagas: injectAsyncSagas(sagaMiddleware),
    };
}
