import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PropTypes from 'prop-types';
import AppWrapper from './AppWrapper';
import {getAsyncInjectors} from '@/utils/asyncInjectors';
import useInjectors from './hooks/useInjectors';
import {useDispatch, useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import {showAlert} from '@/store/root/actions';


const CreatePageComponent = ({Component, reducer, reducerPath, sagas}) => {
    const PComponent = function PageComponent(){
        const _injectors = useInjectors();
        const {injectors} = _injectors;
        const {injectReducer, injectSagas} = injectors;
        const hasInjectedSagas = React.useRef(false);

        React.useEffect(() => {
            injectReducer && reducer && reducerPath && reducer.then(reducer => {
                injectReducer(reducerPath, reducer.default);
                if(!hasInjectedSagas.current && injectSagas && sagas) {
                    hasInjectedSagas.current = true;
                    sagas.then(saga => {
                        const mp = saga.default;
                        return injectSagas(mp);
                    });
                }
            });
        }, [injectReducer, injectSagas]);

        const alert = useSelector(state => state.root.alert);
        const dispatch = useDispatch();

        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        const showToastAlert = React.useCallback((options) => Toast.fire(options), [Toast]);
        React.useEffect(() => {
            if(alert && alert.show === true ) {
                showToastAlert(alert.options).then(
                    () => dispatch(showAlert({show: false, options: {}}))
                );
            }
        }, [alert]);

        return (
            <Component/>
        );
    };
    return PComponent;
};


const createBrowserRouterPrivate = ({
    routes,
    Header,
    SideNav,
    Footer
}) => {
    const newRoutes = routes.map(route => {
        const { isPrivate } = route;

        const Component = CreatePageComponent(route);

        const wrappedComponent = () =>
            <AppWrapper
                Header={Header}
                SideNav={SideNav}
                Footer={Footer}
                Component={Component}
                layout={route.layout}
            />;

        const SecureComponent = () => <PrivateRoute Component={wrappedComponent} roles={route.roles} />;

        return isPrivate ? { ...route, Component: SecureComponent } : { ...route, Component: wrappedComponent };
    });

    return createBrowserRouter(newRoutes);
};


const AppRouterProvider = ({ routes, Header, SideNav, Footer, store, sagaMiddleware }) => {
    const { setInjectors } = useInjectors();
    const isSetInjectors = React.useRef(false);

    React.useEffect(() => {
        if (!store || isSetInjectors.current ) return; // store not present in test env
        isSetInjectors.current = true;
        const _injectors = getAsyncInjectors(store, sagaMiddleware);
        setInjectors(_injectors);
    }, [sagaMiddleware, setInjectors, store]);

    const router = createBrowserRouterPrivate({ routes, Header, SideNav, Footer });
    return (<RouterProvider router={router} />);
};

AppRouterProvider.propTypes = {
    routes: PropTypes.any,
    Header: PropTypes.node,
    SideNav: PropTypes.node,
    Footer: PropTypes.node,
    store: PropTypes.any,
    sagaMiddleware: PropTypes.any
};

export default AppRouterProvider;

