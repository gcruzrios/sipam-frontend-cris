import React from 'react';
import {ROLE_ADMIN, ROLE_ORG} from '@/store/model';

const NotFoundPage = React.lazy(() => import('../Pages/NotFoundPage'));
const InitialPage = React.lazy(() => import('../Pages/InitialPage'));
const LoginPage = React.lazy(() => import('../Pages/LoginPage'));
const Logout = React.lazy(() => import('../Pages/LoginPage/logout'));
const PassRecoveryPage = React.lazy(() => import('../Pages/PasswordRecoveryPage'));
const BlogPreviewPage = React.lazy(() => import('../Pages/BlogPreviewPage'));
const OrganizationsPage = React.lazy(() => import('../Pages/OrganizationsPage'));
const RegisterOrganizationPage = React.lazy(() => import('../Pages/OrganizationsPage/Register'));
const ShowOrganizationPage = React.lazy(() => import('../Pages/OrganizationsPage/Show'));
const EditOrganizationPage = React.lazy(() => import('../Pages/OrganizationsPage/Edit'));
const UsersPage = React.lazy(() => import('../Pages/UsersPage'));
const RegisterUserPage = React.lazy(() => import('../Pages/UsersPage/Register'));
const EditUserPage = React.lazy(() => import('../Pages/UsersPage/Edit'));
const ShowUserPage = React.lazy(() => import('../Pages/UsersPage/Show'));
const GeolocationPage = React.lazy(() => import('../Pages/GeolocationPage'));
const ResourcesPage = React.lazy(() => import('../Pages/ResourcesPage'));
const RegisterResourcesPage = React.lazy(() => import('../Pages/ResourcesPage/Register'));
const LawsPage = React.lazy(() => import('../Pages/LawsPage'));
const RegisterLawPage = React.lazy(() => import('../Pages/LawsPage/Register'));
const EditLawPage = React.lazy(() => import('../Pages/LawsPage/Edit'));
const ShowLawPage = React.lazy(() => import('../Pages/LawsPage/Show'));
const PAMPage = React.lazy(() => import('../Pages/PAMPage'));
const RegisterPAMPage = React.lazy(() => import('../Pages/PAMPage/Register'));
const EditPAMPage = React.lazy(() => import('../Pages/PAMPage/Edit'));
const ShowPAMPage = React.lazy(() => import('../Pages/PAMPage/Show'));
const ExpirationControlPage = React.lazy(() => import('../Pages/ExpirationControlPage'));
const RegisterExpirationDocPage = React.lazy(() => import('../Pages/ExpirationControlPage/Register'));
const ListExpirationsPage = React.lazy(() => import('../Pages/ExpirationControlPage/List'));


export const routes = [
    {
        path: '*',
        Component: NotFoundPage,
        isPrivate: false,
        layout: 'Footer',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/',
        Component: InitialPage,
        sagas: import('../Pages/InitialPage/sagas'),
        reducer: import('../Pages/InitialPage/reducer'),
        reducerPath: 'initialPage',
        isPrivate: true,
        layout: 'Dashboard',
        label: 'Inicio',
        menuIndex: 0,
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/usuarios',
        Component: UsersPage,
        sagas: import('../Pages/UsersPage/sagas'),
        reducer: import('../Pages/UsersPage/reducer'),
        reducerPath: 'usersPage',
        isPrivate: true,
        layout: 'Dashboard',
        label: 'Usuarios',
        menuIndex: 1,
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/usuarios/registrar',
        Component: RegisterUserPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/usuarios/editar/:id',
        Component: EditUserPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/usuarios/ver/:id',
        Component: ShowUserPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/geolocalizacion',
        Component: GeolocationPage,
        sagas: import('../Pages/GeolocationPage/sagas'),
        reducer: import('../Pages/GeolocationPage/reducer'),
        reducerPath: 'geolocationPage',
        isPrivate: true,
        layout: 'Dashboard',
        label: 'Geolocalización',
        menuIndex: 2,
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/recursos',
        Component: ResourcesPage,
        isPrivate: true,
        layout: 'Dashboard',
        label: 'Distribución de recursos',
        menuIndex: 3,
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/recursos/registrar',
        Component: RegisterResourcesPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/leyes',
        Component: LawsPage,
        sagas: import('../Pages/LawsPage/sagas'),
        reducer: import('../Pages/LawsPage/reducer'),
        reducerPath: 'lawsPage',
        isPrivate: true,
        layout: 'Dashboard',
        label: 'Leyes',
        menuIndex: 4,
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/leyes/registrar',
        Component: RegisterLawPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/leyes/editar/:id',
        Component: EditLawPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/leyes/ver/:id',
        Component: ShowLawPage,
        sagas: import('../Pages/LawsPage/sagas'),
        reducer: import('../Pages/LawsPage/reducer'),
        reducerPath: 'lawsPage',
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/pam',
        Component: PAMPage,
        isPrivate: true,
        layout: 'Dashboard',
        label: 'PAM',
        menuIndex: 5,
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/pam/registrar',
        Component: RegisterPAMPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ORG
        ]
    },
    {
        path: '/pam/editar/:id',
        Component: EditPAMPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ORG
        ]
    },
    {
        path: '/pam/ver/:id',
        Component: ShowPAMPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/organizaciones',
        Component: OrganizationsPage,
        sagas: import('../Pages/OrganizationsPage/sagas'),
        reducer: import('../Pages/OrganizationsPage/reducer'),
        reducerPath: 'orgsPage',
        isPrivate: true,
        layout: 'Dashboard',
        label: 'Organizaciones',
        menuIndex: 6,
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/organizaciones/registrar',
        Component: RegisterOrganizationPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/organizaciones/editar/:id',
        Component: EditOrganizationPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/organizaciones/ver/:id',
        Component: ShowOrganizationPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
        ]
    },
    {
        path: '/vencimientos',
        Component: ExpirationControlPage,
        sagas: import('../Pages/ExpirationControlPage/sagas'),
        reducer: import('../Pages/ExpirationControlPage/reducer'),
        reducerPath: 'expirationsPage',
        isPrivate: true,
        layout: 'Dashboard',
        label: 'Control de vencimientos',
        menuIndex: 7,
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/vencimientos/nuevo',
        Component: RegisterExpirationDocPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/vencimientos/lista',
        Component: ListExpirationsPage,
        isPrivate: true,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN
        ]
    },
    {
        path: '/blogPreview/:blogId',
        Component: BlogPreviewPage,
        layout: 'Dashboard',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/login',
        Component: LoginPage,
        layout: 'Footer',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/logout',
        Component: Logout,
        layout: 'Footer',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    },
    {
        path: '/passwordRecovery',
        Component: PassRecoveryPage,
        layout: 'Footer',
        roles: [
            ROLE_ADMIN,
            ROLE_ORG
        ]
    }
];