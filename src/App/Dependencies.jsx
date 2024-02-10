import React, { Suspense } from 'react';
import { routes } from './Routes';
import Header from '../Components/Header';
import { SideNav } from '@/Components/SideNav';
import { AuthProvider } from './hooks/useAuth';
import TopLevel from './TopLevel';
import { Provider } from 'react-redux';
import { store, sagaMiddleware } from '@/store/store';
import BackdropPage from '../Pages/BackdropPage';
import {getMenuItemsFromRoutes, ProviderCompose} from '@/utils/util';
import AppRouterProvider from './AppRouterProvider';
import Footer from '../Components/Footer';
import { ApiProvider } from './hooks/useApi';
import { InjectorsProvider } from './hooks/useInjectors';
import PropTypes from 'prop-types';

const menuItems = getMenuItemsFromRoutes(routes);

const DefaultHeader = <Header />;
const DefaultSideNav = <SideNav navItems={menuItems}/>;
const DefaultFooter = <Footer/>;

const DefaultRouterProvider = () =>
    <AppRouterProvider
        routes={routes}
        Header={DefaultHeader}
        SideNav={DefaultSideNav}
        Footer={DefaultFooter}
        sagaMiddleware={sagaMiddleware}
        store={store} />;


const DefaultAuthProvider = ({ children }) => <AuthProvider>{children}</AuthProvider>;
DefaultAuthProvider.propTypes = {
    children: PropTypes.any
};

const DefaultApiProvider = ({ children }) => <ApiProvider>{children}</ApiProvider>;
DefaultApiProvider.propTypes = {
    children: PropTypes.any
};

const DefaultStoreProvider = ({ children }) => <Provider store={store}>{children}</Provider>;
DefaultStoreProvider.propTypes = {
    children: PropTypes.any
};

const DefaultInjectorsProvider = ({ children }) => <InjectorsProvider>{children}</InjectorsProvider>;
DefaultInjectorsProvider.propTypes = {
    children: PropTypes.any
};

const DefaultBackdropPage = <BackdropPage />;

const SuspenseProvider = ({ children }) => <Suspense fallback={DefaultBackdropPage}>{children}</Suspense>;
SuspenseProvider.propTypes = {
    children: PropTypes.any
};

const DefaultApplicationProvider = ({ children }) => <ProviderCompose
                                                            components={[
                                                                SuspenseProvider,
                                                                DefaultAuthProvider,
                                                                DefaultStoreProvider,
                                                                DefaultApiProvider,
                                                                DefaultInjectorsProvider
                                                            ]}>{children}</ProviderCompose>;
DefaultApplicationProvider.propTypes = {
    children: PropTypes.any
};

const DefaultTopLevel = () =>
    <TopLevel
        Routes={DefaultRouterProvider}
        ApplicationProvider={DefaultApplicationProvider} />;


export default DefaultTopLevel;
