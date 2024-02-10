import React, {useEffect, useRef, useState} from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {useNavigate, useParams} from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {getOrganizacionById, getUserData} from '@/server/api';
import useApi from '../../../App/hooks/useApi';
import * as R from 'ramda';
import {isEmpty} from 'ramda';
import {
    getGeneroById,
    getListaCantones,
    getListaDistritos,
    getListaProvincias,
    getNacionalidadById,
    getRolById,
    getValueById,
    When
} from '@/utils/util';
import {useDispatch, useSelector} from 'react-redux';
import {showAlert} from '@/store/root/actions';

const ShowUserPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const api = useApi();
    const isAppReady = useSelector(state => state.root.isAppReady);

    const [currentUser, setCurrentUser] = useState();
    const listaProvincias = getListaProvincias(useSelector);
    const {
        formState: {errors},
        reset,
    } = useForm({
        defaultValues: React.useMemo(() => {
            return currentUser;
        }, [currentUser])
    });

    const loaded = useRef(false);

    const setData = React.useCallback((data) => {
        if (data && data.Resultado) {
            const user = data.Resultado;
            setCurrentUser(user);
        } else {
            Swal.fire({
                icon: 'error',
                text: 'No se ha encontrado el usuario.',
                button: 'Regresar'
            }).then(
                () => navigate('/usuarios')
            );
        }
    });

    useEffect(() => {
        if (!loaded.current && isAppReady) {
            loaded.current = true;
            api.request(getUserData, params.id).then(setData);
        }
    }, [loaded.current, isAppReady]);

    useEffect(() => {
        if (currentUser) {
            const {idOrganizacion} = currentUser;
            idOrganizacion !== '0' && findObsById(idOrganizacion);
        }
    }, [currentUser]);


    const [provincia, setProvincia] = useState('Cargando...');
    const [canton, setCanton] = useState('Cargando...');
    const [distrito, setDistrito] = useState('Cargando...');
    const setCompleteLocation = React.useCallback(async (provincia, canton, distrito) => {
        console.log('=>(index.jsx:81) provincia, canton, distrito', provincia, canton, distrito);
        if (isEmpty(provincia)) {
            setProvincia('');
            setCanton('');
            setDistrito('');
            return;
        }
        setProvincia(getValueById(listaProvincias, provincia));
        if (isEmpty(canton)) {
            setCanton('');
            setDistrito('');
            return;
        }
        const listaCantones = await getListaCantones(provincia);
        setCanton(getValueById(listaCantones, canton));
        if (isEmpty(distrito)) {
            setDistrito('');
            return;
        }
        const listaDistritos = await getListaDistritos(canton);
        setDistrito(getValueById(listaDistritos, distrito));
    }, [listaProvincias]);

    useEffect(() => {
        if (currentUser && listaProvincias.length && provincia === 'Cargando...') {
            const {idProvincia, idCanton, idDistrito} = currentUser;
            setCompleteLocation(idProvincia, idCanton, idDistrito).then();
        }
    }, [currentUser, listaProvincias]);

    const cedulaJuridicaRef = useRef();
    const codigoObsRef = useRef();
    const nombreOrgRef = useRef();

    const findObsById = (id) => {
        api.request(getOrganizacionById, id).then(
            async data => {
                if (data && data.Resultado && data.Resultado[0]) {
                    const org = data.Resultado[0];
                    cedulaJuridicaRef.current.value = org.cedulaJuridica;
                    nombreOrgRef.current.value = org.nombreOBS;
                    codigoObsRef.current.value = org.codigoInstitucion;
                } else {
                    dispatch(showAlert({
                        show: true,
                        options: {
                            icon: 'error',
                            title: 'No se encontró información de la Organización'
                        }
                    }));
                }
            }
        );
    };


    const getPermisos = (permisos) => {
        if (permisos) {
            const listPermisos = R.map(p => R.prop('nombrePermiso', p), permisos);
            return R.join(', ', listPermisos);
        }
        return 'Ninguno';
    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Ver Usuario</h2>
                </div>
                <div className="row form-row mt-4">
                    <When condition={codigoObsRef.current}>
                        <div className="col-12 col-md-6 col-lg-4">
                            <h5>Código de OBS</h5>
                            <p>{codigoObsRef.current}</p>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <h5>Nombre de Organización</h5>
                            <p>{nombreOrgRef.current}</p>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <h5>Cédula Jurídica</h5>
                            <p>{cedulaJuridicaRef.current}</p>
                        </div>
                    </When>
                </div>
                <br/>
                <div className="row form-row mt-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Número de Indentificación</h5>
                        <p>{currentUser?.cedula}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Correo Personal</h5>
                        <p>{currentUser?.correo}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Número de Teléfono</h5>
                        <p>{currentUser?.telefono}</p>
                    </div>
                </div>
                <br/>
                <div className="row form-row mt-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Nombre</h5>
                        <p>{currentUser?.nombre}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Primer Apellido</h5>
                        <p>{currentUser?.primerApellido}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Segundo Apellido</h5>
                        <p>{currentUser?.segundoApellido}</p>
                    </div>
                </div>
                <br/>
                <div className="row form-row mt-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Fecha de Nacimiento</h5>
                        <p>{currentUser?.fechaNacimiento}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Sexo</h5>
                        <p>{getGeneroById(useSelector, currentUser?.sexo)}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Nacionalidad</h5>
                        <p>{getNacionalidadById(useSelector, currentUser?.nacionalidad)}</p>
                    </div>
                </div>

                <div className="row form-row mt-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Provincia</h5>
                        <p>{provincia}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Cantón</h5>
                        <p>{canton}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Distrito</h5>
                        <p>{distrito}</p>
                    </div>
                </div>

                <div className="row form-row mt-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Usuario</h5>
                        <p>{currentUser?.usuario}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Clave</h5>
                        <p>{currentUser ? '*****' : ''}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Rol</h5>
                        <p>{getRolById(useSelector, currentUser?.rol)}</p>
                    </div>
                </div>

                <div className="col form-row mt-4">
                    <h5>Permisos</h5>
                    <p>{getPermisos(currentUser?.permisos)}</p>
                </div>

                <div className="d-flex justify-content-center mt-5 gap-5">
                    <FormBackButton
                        navigate={navigate}/>
                </div>
            </div>

        </CommonLayout>
    );
};

export default ShowUserPage;