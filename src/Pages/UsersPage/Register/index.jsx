import React, {useRef, useState} from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate} from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {
    getListaCantones,
    getListaDistritos,
    getListaGeneros,
    getListaProvincias,
    getListaRoles,
    getNacionalidades,
    When
} from '@/utils/util';
import {useDispatch, useSelector} from 'react-redux';
import OptionsSelector from '../../../Components/Fields/OptionsSelector';
import {PermisosSelector} from '@/Components/OptionsChooser/PermisosSelector';
import {agregarUsuario, getOrganizacionByCodigo} from '@/server/api';
import useApi from '../../../App/hooks/useApi';
import {showAlert} from '@/store/root/actions';
import {refreshUserList} from '../actions';

const RegisterOrganizationPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const api = useApi();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

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
    const nombreOrgRef = useRef();
    const idObsRef = useRef();

    const handleRegister = async (data) => {

        const body = {
            ...data,
            idDistrito: distrito,
            permiso: sourceSelected,
            sexo: genero,
            estado: 'A',
            rol,
            nacionalidad,
            idOrganizacion: idObsRef.current || '0'
        };

        await api.request(agregarUsuario, body).then(
            (resp) => {
                if (resp.outCodigo === '200') {
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
                } else {
                    const message = resp.outMensaje || 'Ha ocurrido un error inesperado con la solicitud. Intente de nuevo más tarde.';
                    dispatch(showAlert({
                        show: true,
                        options: {
                            icon: 'error',
                            title: message
                        }
                    }));
                }
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

    const findObs = () => {
        const codigo = codigoObsRef.current.value;
        api.request(getOrganizacionByCodigo, codigo).then(
            async data => {
                if (data && data.Resultado && data.Resultado[0]) {
                    const org = data.Resultado[0];
                    idObsRef.current = org.idOBS;
                    cedulaJuridicaRef.current.value = org.cedulaJuridica;
                    nombreOrgRef.current.value = org.nombreOBS;

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
                    <h2>Registro de Usuario</h2>
                </div>
                <form onSubmit={handleSubmit(handleRegister)}>
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
                                {...register('usuario', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label
                                htmlFor="claveInput"
                                className="form-label">
                                Clave
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="claveInput"
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
                    <br/>
                    <When condition={rol && rol !== '1'}>
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
                                            onClick={() => findObs()}
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
                                    ref={nombreOrgRef}
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
                    </When>
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
                                id="correoPersonalInput"
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