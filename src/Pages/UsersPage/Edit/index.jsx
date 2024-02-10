import React, {useEffect, useRef, useState} from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate, useParams} from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {
    getListaCantones,
    getListaDistritos,
    getListaGeneros,
    getListaProvincias,
    getListaRoles,
    getNacionalidades
} from '@/utils/util';
import {useDispatch, useSelector} from 'react-redux';
import OptionsSelector from '../../../Components/Fields/OptionsSelector';
import {PermisosSelector} from '@/Components/OptionsChooser/PermisosSelector';
import {editarUsuario, getOrganizacionByCodigo, getOrganizacionById, getUserData} from '@/server/api';
import useApi from '../../../App/hooks/useApi';
import {showAlert} from '@/store/root/actions';
import {join, map} from 'ramda';
import {refreshUserList} from '../actions';

const RegisterOrganizationPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const api = useApi();
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        defaultValues: React.useMemo(() => {
            return currentUser;
        }, [currentUser])
    });
    const isAppReady = useSelector(state => state.root.isAppReady);

    const [currentUser, setCurrentUser] = useState();

    const [sourceSelected, setSourceSelected] = useState('1');
    const permisos = useSelector(state => state.root.permisos);

    const [provincia, setProvincia] = useState('');
    const listaProvincias = getListaProvincias(useSelector);

    const [canton, setCanton] = useState('');
    const [listaCantones, setListaCantones] = useState([]);

    const [distrito, setDistrito] = useState('');
    const [listaDistritos, setListaDistritos] = useState([]);

    const [genero, setGenero] = useState('');
    const listaGeneros = getListaGeneros();

    const [rol, setRol] = useState('');
    const listaRoles = getListaRoles();

    const [nacionalidad, setNacionalidad] = useState('');
    const listaNacionalidades = getNacionalidades(useSelector);

    const cedulaJuridicaRef = useRef();
    const codigoObsRef = useRef();
    const nombreObsRef = useRef();
    const idObsRef = useRef();

    const loaded = useRef(false);

    const setCompleteLocation = async (provincia, canton, distrito) => {
        setProvincia(provincia);
        const listaCantones = await getListaCantones(provincia);
        setListaCantones(listaCantones);
        setCanton(canton);
        const listaDistritos = await getListaDistritos(canton);
        setListaDistritos(listaDistritos);
        setDistrito(distrito);
    };

    const setData = (data) => {
        if (data && data.Resultado) {
            const user = data.Resultado;
            const {fechaNacimiento} = user;
            const fechaNac = fechaNacimiento && fechaNacimiento !== '' ? new Date(fechaNacimiento).toISOString().split('T')[0] : '';
            setCurrentUser({
                ...user,
                fechaNacimiento: fechaNac,
            });
            reset({
                ...user,
                fechaNacimiento: fechaNac,
            });
        } else {
            Swal.fire({
                icon: 'error',
                text: 'No se ha encontrado el usuario.',
                button: 'Regresar'
            }).then(
                () => navigate('/usuarios')
            );
        }
    };

    useEffect(() => {
        if (isAppReady && !currentUser && !loaded.current) {
            loaded.current = true;
            api.request(getUserData, params.id).then(setData);
        }
    }, [isAppReady]);

    useEffect(() => {
        if (currentUser) {
            const {idProvincia, idCanton, idDistrito, nacionalidad, permisos, sexo, rol} = currentUser;
            setGenero(sexo);
            setRol(rol);
            setNacionalidad(nacionalidad);
            const permisosList = join(' | ', map((p) => p.idPermiso, permisos));
            setSourceSelected(permisosList);
            setCompleteLocation(idProvincia, idCanton, idDistrito).then();
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            const {idOrganizacion} = currentUser;
            if (idOrganizacion !== '0') {
                findObsById(idOrganizacion);
            } else {
                nombreObsRef.current.value = 'CONAPAM';
            }

        }
    }, [currentUser]);

    const handleEdit = async (data) => {
        const body = {
            ...data,
            idUsuario: currentUser.idUsuario,
            idDistrito: distrito,
            permiso: sourceSelected,
            sexo: genero,
            rol,
            nacionalidad,
            idOrganizacion: idObsRef.current
        };

        await api.request(editarUsuario, body).then(
            () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'La organizacion ha sido registrada.',
                    button: 'Continuar'
                }).then(
                    () => {
                        dispatch(refreshUserList());
                        navigate('/usuarios');
                    }
                );
            }
        );
    };

    const handleSourceSelected = (source) => {
        setSourceSelected(source);
    };

    const handleProviciaSelected = (event) => {
        const provincia = event.target.value;
        setProvincia(provincia);
        setCanton('');
        getListaCantones(provincia).then(setListaCantones);
        setListaDistritos([]);
    };
    const handleCantonSelected = (event) => {
        const canton = event.target.value;
        setCanton(canton);
        getListaDistritos(canton).then(setListaDistritos);
    };

    const handleDistritoSelected = (event) => {
        const distrito = event.target.value;
        setDistrito(distrito);
    };


    const handleGeneroSelected = (event) => {
        const genero = event.target.value;
        setGenero(genero);
    };

    const handleRolSelected = (event) => {
        const rol = event.target.value;
        setRol(rol);
    };

    const handleNacionalidadSelected = (event) => {
        const nacionalidad = event.target.value;
        setNacionalidad(nacionalidad);
    };

    const findObsById = (id) => {
        api.request(getOrganizacionById, id).then(
            async data => {
                if (data && data.Resultado && data.Resultado[0]) {
                    const org = data.Resultado[0];
                    idObsRef.current = org.id;
                    cedulaJuridicaRef.current.value = org.cedulaJuridica;
                    nombreObsRef.current.value = org.nombreOBS;
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

    const findObsByCodigo = () => {
        const codigo = codigoObsRef.current.value;
        api.request(getOrganizacionByCodigo, codigo).then(
            async data => {
                if (data && data.Resultado && data.Resultado[0]) {
                    const org = data.Resultado[0];
                    idObsRef.current = org.id;
                    cedulaJuridicaRef.current.value = org.cedulaJuridica;
                    nombreObsRef.current.value = org.nombreOBS;

                    dispatch(showAlert({
                        show: true,
                        options: {
                            icon: 'success',
                            title: 'Organización encontrada'
                        }
                    }));
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: 'No se ha encontrado la organización.',
                        button: 'Regresar'
                    }).then();
                }
            }
        );

    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Editar Usuario</h2>
                </div>
                <form onSubmit={handleSubmit(handleEdit)}>
                    <div className="row form-row mt-5">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="usuarioInput"
                                className="form-label">
                                Usuario
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="usuarioInput"
                                disabled
                                {...register('usuario', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="claveInput"
                                className="form-label">
                                Clave
                            </label>
                            <input
                                autoComplete="false"
                                type="password"
                                className="form-control"
                                id="claveInput"
                                disabled
                                {...register('clave', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="rolesInput"
                                className="form-label">Rol</label>
                            <OptionsSelector
                                className="form-select"
                                id="rolesInput"
                                options={listaRoles}
                                placeholder={'Seleccione un rol'}
                                onChange={handleRolSelected}
                                value={rol}
                            />
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="codigoObsInput" className="form-label">Código de OBS</label>
                            <div className="input-group">
                                <input ref={codigoObsRef}
                                       type="text"
                                       className="form-control"
                                       id="codigoObsInput"/>
                                <button className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => findObsByCodigo()}
                                        id="button-find-cedula">
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="nombreOrganizacionInput"
                                className="form-label">
                                Nombre Organización
                            </label>
                            <input
                                ref={nombreObsRef}
                                type="text"
                                className="form-control"
                                id="nombreOrganizacionInput"
                                disabled/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="cedulaJuridicaInput"
                                className="form-label">
                                Cedula Jurídica
                            </label>
                            <input
                                ref={cedulaJuridicaRef}
                                type="text"
                                className="form-control"
                                id="cedulaJuridicaInput"
                                disabled/>
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="numeroIdentificacionInput"
                                className="form-label">
                                Número de Identificación
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="numeroIdentificacionInput"
                                {...register('cedula', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="correoPersonalInput"
                                className="form-label">
                                Correo Personal
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="correoPersonalInput"
                                {...register('correo', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="numeroTelefonoInput"
                                className="form-label">
                                Número de telefono
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="numeroTelefonoInput"
                                {...register('telefono', {required: false})}/>
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="nombreInput"
                                className="form-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombreInput"
                                {...register('nombre', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="primerApellidoInput"
                                className="form-label">
                                Primer Apellido
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="primerApellidoInput"
                                {...register('primerApellido', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="segundoApellidoInput"
                                className="form-label">
                                Segundo Apellido
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="segundoApellidoInput"
                                {...register('segundoApellido', {required: false})}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row form-row mt-5">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="emailRepresentanteInput"
                                className="form-label">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="emailRepresentanteInput"
                                {...register('fechaNacimiento', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="sexoInput"
                                className="form-label">
                                Sexo
                            </label>
                            <OptionsSelector
                                className="form-select"
                                id="sexoInput"
                                options={listaGeneros}
                                placeholder={'Seleccione un género'}
                                onChange={handleGeneroSelected}
                                value={genero}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="nacionalidadInput"
                                   className="form-label">Nacionalidad</label>
                            <OptionsSelector
                                className="form-select"
                                id="nacionalidadnput"
                                options={listaNacionalidades}
                                placeholder={'Seleccione una nacionalidad'}
                                onChange={handleNacionalidadSelected}
                                value={nacionalidad}
                            />
                        </div>
                    </div>
                    <div className="row form-row mt-5">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="provinciaInput" className="form-label">Provincia</label>
                            <OptionsSelector
                                className="form-select"
                                id="provinciaInput"
                                options={listaProvincias}
                                placeholder={'Seleccione una provincia'}
                                onChange={handleProviciaSelected}
                                value={provincia}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="cantonInput" className="form-label">Cantón</label>
                            <OptionsSelector
                                className="form-select"
                                id="cantonInput"
                                options={listaCantones}
                                placeholder={provincia && provincia !== '' ? 'Seleccione un canton' : ''}
                                onChange={handleCantonSelected}
                                value={canton}
                                disabled={!(provincia && provincia !== '')}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="distritoInput" className="form-label">Distrito</label>
                            <OptionsSelector
                                className="form-select"
                                id="distritoInput"
                                options={listaDistritos}
                                placeholder={canton && canton !== '' ? 'Seleccione un distrito' : ''}
                                onChange={handleDistritoSelected}
                                value={distrito}
                                disabled={!(canton && canton !== '')}
                            />
                        </div>
                    </div>


                    <div className="col form-row mt-4">
                        <label className="form-check-label" htmlFor="radioGroupeModalidad">Permisos</label>
                        <PermisosSelector
                            sources={permisos}
                            sourceSelected={sourceSelected}
                            onSourceSelected={handleSourceSelected}
                            position={'start'}
                        />
                    </div>

                    <div className="d-flex justify-content-center mt-5 gap-5">
                        <FormBackButton
                            navigate={navigate}/>
                        <FlatButton
                            label="REGISTRAR"
                            btnStyle="primary"
                            type="submit"
                        />
                    </div>

                </form>
            </div>

        </CommonLayout>
    );
};

export default RegisterOrganizationPage;