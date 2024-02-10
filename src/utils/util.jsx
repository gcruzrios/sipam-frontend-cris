import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';
import {getCantones, getDistritos} from '@/server/api';
import * as R from 'ramda';
import {find, split} from 'ramda';
import moment from 'moment';
import _ from 'lodash';

export const asyncDebounce = (defaultFn, defaultWait) => {
    return _.debounce(defaultFn, defaultWait);
}

export const randomUID = () => {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const getDaysLeft = (date, daysLeft) => {
    try {
        const dayAdded = moment(date);
        const dayExpiration = dayAdded.add(daysLeft, 'd');
        const now = moment(moment.now());
        return dayExpiration.diff(now, 'days');
    } catch (e) {
        console.error('=>(util.jsx:17) error', e);
        return 0;
    }

};

export function getBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        const _file = split(',', reader.result)[1];
        callback(_file);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export const getTipoDocumentoById = (id, tiposDoc) => {
    const tipoDoc = tiposDoc.find(e => e.id === id);
    return tipoDoc?.value;
};

export const getTiposDocumento = (useSelector) => {
    const tiposDoc = useSelector(state => state.root.tiposDocumento);
    return tiposDoc.filter(
        n => (!n.estado || n.estado === 'A' || n.Estado === 'A')
    ).map(
        n => ({
            id: n.idTipoDocumento,
            value: n.descripcion
        })
    );
};

export const getTipoIdentificacionById = (useSelector, id) => {
    const tiposId = useSelector(state => state.root.tiposIdentificacion);
    return tiposId.find(
        n => n.idTipoIdentificacion === id
    )?.descripcion;
};

export const getTiposIdentificacion = (useSelector) => {
    const tiposId = useSelector(state => state.root.tiposIdentificacion);
    return tiposId.filter(
        n => (!n.estado || n.estado === 'A' || n.Estado === 'A')
    ).map(
        n => ({
            id: n.idTipoIdentificacion,
            value: n.descripcion
        })
    );
};

export const getNacionalidadById = (useSelector, idNacionalidad) => {
    const nacionalidades = useSelector(state => state.root.nacionalidades);
    return nacionalidades.find(n => n.idNacionalidad === idNacionalidad)?.pais;
};

export const getNacionalidades = (useSelector) => {
    const nacionalidades = useSelector(state => state.root.nacionalidades);
    return nacionalidades.map(
        n => ({
            id: n.idNacionalidad,
            value: n.pais
        })
    );
};

export const getEstadoCivilById = (id) => {
    const estadoCivilList = useSelector(state => state.root.estadoCivil);
    const estadoCivil = estadoCivilList.find(e => e.idEstadoCivil === id);
    return estadoCivil?.descripcion;
};

export const getEstadosCiviles = (useSelector) => {
    const estadoCivilList = useSelector(state => state.root.estadoCivil);
    return estadoCivilList?.map(e => ({
        id: e.idEstadoCivil,
        value: e.descripcion
    }));
};

export const getGradosDependenciaById = (useSelector, id) => {
    const grados = useSelector(state => state.root.gradosDependencia);
    return grados?.find(e => e.idGradoDependencia === id)?.descripcion;
};
export const getGradosDependencia = (useSelector) => {
    const grados = useSelector(state => state.root.gradosDependencia);
    return grados?.map(e => ({
        id: e.idGradoDependencia,
        value: e.descripcion
    }));
};

export const getRolById = (useSelector, id) => {
    const roles = useSelector(state => state.root.roles);
    const rol = roles.find(e => e.idRol === id);
    return rol?.nombreRol;
};

export const getGeneroById = (useSelector, id) => {
    const generosList = useSelector(state => state.root.generos);
    const genero = generosList.find(e => e.idSexo === id);
    return genero?.descripcion;
};

export const getLatLngFromGeolocation = (geolocation) => {
    if (geolocation) {
        const lat = parseFloat(R.head(R.split(',', geolocation)));
        const lng = parseFloat(R.last(R.split(',', geolocation)));
        return {lat, lng};
    } else {
        return null;
    }
};

export const getListaRoles = () => {
    const roles = useSelector(state => state.root.roles);

    return roles.filter(
        n => (!n.estado || n.estado === 'A' || n.Estado === 'A')
    ).map(
        rol => ({
            id: rol.idRol,
            value: rol.nombreRol
        })
    );
};

export const getListaGeneros = () => {
    const generos = useSelector(state => state.root.generos);

    return generos.filter(
        n => (!n.estado || n.estado === 'A' || n.Estado === 'A')
    ).map(
        genero => ({
            id: genero.idSexo,
            value: genero.descripcion
        })
    );
};


export const getTiposPobreza = () => {
    return ([
        {
            id: '1',
            value: 'Pobreza Básica'
        },
        {
            id: '2',
            value: 'Pobreza Extrema'
        }]);
};

export const getTipoPobrezaById = (id) => {
    return getTiposPobreza().find(t => t.id === id)?.value;
}

export const getListaProvincias = (useSelector) => {
    const provincias = useSelector(state => state.root.provincias);

    return provincias.map(
        provincia => ({
            id: provincia.idProvincia,
            value: provincia.nombre
        })
    );
};

export const getNivelAcademicoById = (useSelector, id) => {
    const niveles = useSelector(state => state.root.nivelAcademico);

    return niveles.find(
        n => n.idNivelAcademico === id
    )?.descripcion;
};

export const getNivelAcademico = (useSelector) => {
    const niveles = useSelector(state => state.root.nivelAcademico);

    return niveles.map(
        n => ({
            id: n.idNivelAcademico,
            value: n.descripcion
        })
    );
};

export const getProgramas = (useSelector) => {
    const programas = useSelector(state => state.root?.programas);

    return programas.map(
        n => ({
            id: n.idProgramas,
            value: n.nombrePrograma
        })
    );
};

export const getValueById = (list, id) => {
    return list.find(p => p.id === id).value;
};

export const getListaEstados = () => [
    {
        id: '1',
        value: 'Pendientes',
        singular: 'Pendiente',
        estado: 'A'
    },
    {
        id: '2',
        value: 'Aceptados',
        singular: 'Aceptado',
        estado: 'A'
    },
    {
        id: '3',
        value: 'Rechazados',
        singular: 'Rechazado',
        estado: 'A'
    }
];

export const getEstadoDocById = (id) => {
    const estados = getListaEstados();
    const idFilter = (value) => value.id === id;
    return find(idFilter, estados).singular;
};

export const getListaCantones = async (provincia) => {
    if (provincia === '') return [];
    const listaCantones = await getCantones(provincia);

    const cantones = listaCantones?.Resultado || [];

    return cantones.map(
        canton => ({
            id: canton.idCanton,
            value: canton.nombre
        })
    );
};

export const getListaDistritos = async (canton) => {
    if (canton === '') return [];
    const listaDistritos = await getDistritos(canton);

    const distritos = listaDistritos?.Resultado || [];

    return distritos.map(
        distrito => ({
            id: distrito.idDistrito,
            value: distrito.nombre
        })
    );
};

export const getMenuItemsFromRoutes = (routes) => {
    const isMenuItem = route => R.has('menuIndex')(route) && R.has('label')(route);
    const menuItems = R.compose(R.map(R.pick(['menuIndex', 'label', 'path', 'roles'])), R.filter(isMenuItem))(routes);
    const sortMenuItems = R.sortWith([R.ascend(R.prop('menuIndex'))]);
    return sortMenuItems(menuItems);
};

export const catchFetchErrors = error => {
    const status = error.response?.status;
    const message = error.response?.message;
    let title;
    switch (status) {
        case 201:
            title = message || 'Usuario o contraseña incorrectos.';
            break;
        case 400:
            title = message || 'Error de autenticación.';
            break;
        default:
            title = message || 'Ocurrió un error al intentar conectar con el servidor. Intente de nuevo más tarde.';
    }

    Swal.fire({
        icon: 'error',
        title: title
    }).then(noop);
};

export const IfElse = ({condition, then, children}) =>
    condition ? (then instanceof Function ? then() : then) || null : React.Children.toArray(children) || null;
IfElse.propTypes = {
    condition: PropTypes.bool,
    then: PropTypes.node,
    children: PropTypes.node,

};

export const When = ({condition, children}) => (condition ? React.Children.toArray(children) || null : null);
When.propTypes = {
    condition: PropTypes.bool,
    children: PropTypes.node,

};

export const Unless = ({condition, children}) => (condition ? null : React.Children.toArray(children) || null);
Unless.propTypes = {
    condition: PropTypes.bool,
    children: PropTypes.node,

};

export function noop() {
}


export function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve({delay: ms}), ms));
}

export function ProviderCompose(props) {
    const {components = [], children} = props;

    return (
        <>
            {components.reduceRight((acc, Comp) => {
                return <Comp>{acc}</Comp>;
            }, children)}
        </>
    );
}

ProviderCompose.propTypes = {
    components: PropTypes.arrayOf(PropTypes.func),
    children: PropTypes.object
};