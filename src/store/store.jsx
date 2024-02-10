import { combineReducers, } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import UserReducer from './users/reducer';
import RootReducer from './root/reducer';
import rootSaga from './root/sagas';

const reducers = {
    user: UserReducer,
    root: RootReducer
};

export const sagaMiddleware = createSagaMiddleware();

export const createReducers = (asyncReducers) => combineReducers({
    ...asyncReducers,
    ...reducers
});

export const store = configureStore({
        reducer: createReducers(),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
    });


store.asyncReducers = {}; // Async reducer registry

sagaMiddleware.run(rootSaga);