import React, {useState} from 'react';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate} from 'react-router-dom';
import OptionsSelector from '../../../Components/Fields/OptionsSelector';
import {
    getBase64,
    getEstadosCiviles,
    getGradosDependencia,
    getListaCantones,
    getListaDistritos,
    getListaGeneros,
    getListaProvincias,
    getNacionalidades,
    getNivelAcademico,
    getTiposIdentificacion,
    getTiposPobreza, getValueById,
    When
} from '@/utils/util';
import {EditableMapComponent} from '@/Components/Maps/EditableMap';
import {
    agregarDatosPam,
    agregarPersonaPam,
    getListadoPAM,
    getPersonaDIMEX,
    getPersonaPadron
} from '@/server/api';
import {showAlert} from '@/store/root/actions';
import {YesNoSelector} from '@/Components/Fields/YesNoSelector';
import useApi from '../../../App/hooks/useApi';
import {useDispatch, useSelector} from 'react-redux';
import {ModalidadSelector} from '@/Components/OptionsChooser/ModalidadSelector';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {ChooseFileButton} from '@/Components/Buttons/ChooseFileButton';
import {assoc, isEmpty} from 'ramda';
import {refreshListadoPam} from '../../InitialPage/actions';
import {getLocationCoordinates} from '@/server/googleApi';

const RegisterOrganizationPage = () => {
    const navigate = useNavigate();
    const api = useApi();
    const dispatch = useDispatch();
    const iconBack = <FontAwesomeIcon icon={faAngleLeft}/>;

    const [currentUser, setCurrentUser] = useState({});

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        getValues
    } = useForm(
        {
            defaultValues: React.useMemo(() => {
                return currentUser;
            }, [currentUser])
        }
    );

    const [pdfSinirube, setPdfSinirube] = useState();
    const [pdfPension, setPdfPension] = useState();

    const [provincia, setProvincia] = useState('');
    const listaProvincias = getListaProvincias(useSelector);

    const [canton, setCanton] = useState('');
    const [listaCantones, setListaCantones] = useState([]);

    const [distrito, setDistrito] = useState('');
    const [listaDistritos, setListaDistritos] = useState([]);

    const [genero, setGenero] = useState('');
    const listaGeneros = getListaGeneros();

    const [tipoPobreza, setTipoPobreza] = useState('');
    const tiposPobreza = getTiposPobreza();

    const [nacionalidad, setNacionalidad] = useState('');
    const listaNacionalidades = getNacionalidades(useSelector);

    const [tipoIdentificacion, setTipoIdentificacion] = useState('');
    const tiposIdentificacion = getTiposIdentificacion(useSelector);

    const [sourceSelected, setSourceSelected] = useState('1');
    const modalities = useSelector(state => state.root.modalidades);

    const [nivelAcademico, setNivelAcademico] = useState('');
    const nivelesAcademicos = getNivelAcademico(useSelector);

    const [estadoCivil, setEstadoCivil] = useState('');
    const estadosCiviles = getEstadosCiviles(useSelector);

    const [gradoDependencia, setGradoDependencia] = useState('');
    const gradosDependencia = getGradosDependencia(useSelector);

    const [marker, setMarker] = useState(null);

    const [pdfB64Sinirube, setPdfB64Sinirube] = useState();
    const [pdfB64Pension, setPdfB64Pension] = useState();

    const idOBS = useSelector(state => state.user?.idOrganizacion);

    const handleRegister = async (data) => {
        try {

            const {
                identificacion,
                nombre,
                primerApellido,
                segundoApellido,
                direccionExacta,
                fechaNacimiento,
                CalificaSINIRUBE,
                conPension,
                montoPensionBruta,
                montoPensionNeta,
                conAporteFamiliar,
                montoAporteFamiliar,
                ObserAporteFamiliar,
                conOtrosIngresos,
                montoOtrosIngresos,
                calificaLey7972,
                calificaLey9188
            } = data;

            const datosPersonaPam = {
                idTipoIdentificacion: tipoIdentificacion,
                identificacion,
                nombre,
                primerApellido,
                segundoApellido,
                direccionExacta,
                geolocalizacion: `${latLng.current.lat},${latLng.current.lng}`,
                correoElectronico: '',
                telefono: '',
                fechaNacimiento,
                idNivelAcademico: nivelAcademico,
                idGenero: genero,
                idEstadoCivil: estadoCivil,
                idNacionalidad: nacionalidad,
                idDistrito: distrito,
                estado: 'A'
            };
            const resultDataPersona = await api.request(agregarPersonaPam, datosPersonaPam);
            if (!resultDataPersona || !resultDataPersona.outIdPersonaPAM) {
                const message = resultDataPersona.outMensaje;
                await Swal.fire({
                    icon: 'error',
                    title: 'Ha sucedido un error al registrar los datos del usuario',
                    text: `${message}\nIntente de nuevo.`,
                    button: 'Regresar'
                });
                return;
            }
            const idPersona = resultDataPersona.outIdPersonaPAM;
            const nombrePdfSinirube = pdfSinirube?.name;
            const nombrePdfPension = pdfPension?.name;

            const datosRegistroPam = {
                idPersona,
                CalificaSINIRUBE,
                idIndiceProbreza: tipoPobreza,
                idGradoDependencia: gradoDependencia,
                conPension,
                montoPensionBruta: conPension === 'S' ? montoPensionBruta : '0',
                montoPensionNeta: conPension === 'S' ? montoPensionNeta : '0',
                conAporteFamiliar,
                montoAporteFamiliar: conAporteFamiliar === 'S' ? montoAporteFamiliar : '0',
                ObserAporteFamiliar: conAporteFamiliar === 'S' ? ObserAporteFamiliar : '',
                conOtrosIngresos,
                montoOtrosIngresos: conOtrosIngresos === 'S' ? montoOtrosIngresos : '0',
                estado: 'A',
                idOBS,
                nombre_PDF_SINIRUBE: CalificaSINIRUBE === 'S' ? nombrePdfSinirube : '',
                PDF_SINIRUBE: CalificaSINIRUBE === 'S' ? pdfB64Sinirube : '',
                nombre_PDF_PENSION: conPension === 'S' ? nombrePdfPension : '',
                PDF_PENSION: conPension === 'S' ? pdfB64Pension : '',
                calificaLey7972,
                calificaLey9188,
                idModalidad: sourceSelected,
                fechaRegistro: new Date().toISOString()
            };

            const resultadoGeneral = await api.request(agregarDatosPam, datosRegistroPam);

            if (!resultadoGeneral || resultadoGeneral.outCodigo !== '200') {
                const message = resultadoGeneral.outMensaje;
                await Swal.fire({
                    icon: 'error',
                    title: 'Ha sucedido un error al registrar los datos del PAM',
                    text: `${message}\nRevise los datos ingresados e intente de nuevo.`,
                    button: 'Regresar'
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'El PAM ha sido registrado satisfactoriamente.',
                button: 'Continuar'
            }).then(
                () => {
                    dispatch(refreshListadoPam());
                    navigate('/pam');
                }
            );

        } catch (e) {
            console.error('Error: ', e);
        }
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

    const handleDistritoSelected = async (event) => {
        const distrito = event.target.value;
        setDistrito(distrito);
        try {
            const locationCoords = await getLocationCoordinates(getValueById(listaProvincias,provincia), getValueById(listaDistritos, distrito));

            if (locationCoords) {
                const {results} = locationCoords;
                if (results && !isEmpty(results)) {
                    const {location} = results[0].geometry;
                    if (location) {
                        const marker = {
                            position: location,
                            name: 'Posición'
                        };
                        setMarker(marker);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }

    };

    const handleGeneroSelected = (event) => {
        const genero = event.target.value;
        setGenero(genero);
    };

    const handleNacionalidadSelected = (event) => {
        const nacionalidad = event.target.value;
        setNacionalidad(nacionalidad);
    };

    const handleTiposIdSelected = (event) => {
        const tipoId = event.target.value;
        setTipoIdentificacion(tipoId);
    };

    const handleSourceSelected = (source) => {
        setSourceSelected(source);
    };

    const setCompleteLocation = async (provincia, canton, distrito) => {
        setProvincia(provincia);
        const listaCantones = await getListaCantones(provincia);
        setListaCantones(listaCantones);
        setCanton(canton);
        const listaDistritos = await getListaDistritos(canton);
        setListaDistritos(listaDistritos);
        setDistrito(distrito);
    };

    const findPerson = async () => {
        const {identificacion} = getValues();
        if (!identificacion || identificacion === '' || identificacion.length < 9 || identificacion.length > 13) {
            dispatch(showAlert({
                show: true,
                options: {
                    icon: 'warning',
                    title: 'Ingrese una identificación válida.'
                }
            }));
            return;
        }
        const personaRegistrada = await api.request(getListadoPAM, {cedula: identificacion, idModalidad: '%'});
        if (personaRegistrada && personaRegistrada.Resultado && personaRegistrada.Resultado?.[0]) {
            Swal.fire({
                icon: 'question',
                title: 'Ya se encuentra un usuario registrado con esa identificación.',
                text: '¿Desea editarlo?',
                confirmButtonText: 'Editar',
                confirmButtonColor: '#015A96',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#044784'
            }).then(
                result => {
                    if (result.isConfirmed) {
                        navigate(`/pam/editar/${identificacion}`);
                    }
                }
            );
            reset(null);
            return;
        }
        if (tipoIdentificacion === '1' || tipoIdentificacion === '2') {
            api.request(getPersonaPadron, identificacion).then(
                async data => {
                    if (data && data.Resultado && data.Resultado.NOMBRE) {
                        const user = data.Resultado;
                        const userData = {
                            nombre: user.NOMBRE,
                            primerApellido: user.PRIMER_APELLIDO,
                            segundoApellido: user.SEGUNDO_APELLIDO
                        };
                        setCurrentUser(userData);
                        reset(userData);
                        dispatch(showAlert({
                            show: true,
                            options: {
                                icon: 'success',
                                title: 'Usuario encontrado en el TSE'
                            }
                        }));
                    } else {
                        dispatch(showAlert({
                            show: true,
                            options: {
                                icon: 'error',
                                title: 'No se ha encontrado la persona en el padrón'
                            }
                        }));
                    }
                }
            );
        } else {
            api.request(getPersonaDIMEX, identificacion).then(
                async data => {
                    if (data && data.Resultado && data.Resultado.NOMBRE) {
                        const user = data.Resultado;
                        const userData = {
                            nombre: user.NOMBRE,
                            primerApellido: user.PRIMER_APELLIDO,
                            segundoApellido: user.SEGUNDO_APELLIDO
                        };
                        setCurrentUser(userData);
                        reset(userData);
                        dispatch(showAlert({
                            show: true,
                            options: {
                                icon: 'success',
                                title: 'Usuario encontrado en el TSE'
                            }
                        }));
                    } else {
                        dispatch(showAlert({
                            show: true,
                            options: {
                                icon: 'error',
                                title: 'No se ha encontrado la persona en el padrón'
                            }
                        }));
                    }
                }
            );
        }

    };

    const latLng = React.useRef({});
    const setLatLng = (coords) => {
        latLng.current = coords;
    };

    const [fase, setFase] = useState('I');

    const handlePdfSinirubeLoaded = (file) => {
        setPdfSinirube(file);
        if (file) {
            getBase64(file, (fileB64) => {
                setPdfB64Sinirube(fileB64);
            });
        } else {
            setPdfB64Sinirube(null);
        }
    };

    const handlePdfPensionLoaded = (file) => {
        setPdfPension(file);
        if (file) {
            getBase64(file, (fileB64) => {
                setPdfB64Pension(fileB64);
            });
        } else {
            setPdfB64Pension(null);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            findPerson();
        }
    };

    const handleTipoPobrezaSelected = (event) => {
        const tipo = event.target.value;
        setTipoPobreza(tipo);
    };

    const handlenivelAcademicoSelected = (event) => {
        const nivel = event.target.value;
        setNivelAcademico(nivel);
    };

    const handleEstadoCivilSelected = (event) => {
        const estado = event.target.value;
        setEstadoCivil(estado);
    };

    const handleGradoDepSelected = (event) => {
        const grado = event.target.value;
        setGradoDependencia(grado);
    };

    const setElementValue = (key, value) => {
        setCurrentUser(assoc(key, value, currentUser));
    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Ingreso PAM Fase {fase}</h2>
                </div>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div hidden={fase === 'II'}>
                        <div className="row form-row mt-4">
                            <div className="col-12 col-md-6 col-lg-4">
                                <label
                                    htmlFor="nombreObsGlInput"
                                    className="form-label">
                                    Tipo de Identificación
                                </label>
                                <OptionsSelector
                                    className="form-select"
                                    id="sexoInput"
                                    options={tiposIdentificacion}
                                    placeholder={'Seleccione un tipo de identificación'}
                                    onChange={handleTiposIdSelected}
                                    value={tipoIdentificacion}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label
                                    htmlFor="cedulaJuridicaInput"
                                    className="form-label">
                                    Cédula Juridica
                                </label>
                                <div className="input-group">
                                    <input type="text"
                                           className="form-control"
                                           id="cedulaJuridicaInput"
                                           disabled={!tipoIdentificacion}
                                           {...register('identificacion', {required: true})}
                                           enterKeyHint={'done'}
                                           onKeyDown={handleKeyPress}/>
                                    <button className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => findPerson()}
                                            disabled={!tipoIdentificacion}
                                            id="button-find-cedula">
                                        Buscar
                                    </button>
                                </div>
                            </div>
                        </div>
                        {getValues().identificacion && (
                            <>
                                <div className="row form-row mt-4">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="nameInput" className="form-label">Nombre</label>
                                        <input type="text" className="form-control" id="nameInput"
                                               {...register('nombre', {required: true})}/>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="fisrtLastName" className="form-label">Primer
                                            Apellido</label>
                                        <input type="text" className="form-control" id="fisrtLastName"
                                               {...register('primerApellido', {required: true})}/>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="secondLastName" className="form-label">Segundo
                                            Apellido</label>
                                        <input type="text" className="form-control" id="secondLastName"
                                               {...register('segundoApellido', {required: true})}/>
                                    </div>
                                </div>
                                <div className="row form-row mt-4">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="califSinirubeInput" className="form-label">Califica
                                            SINIRUBE</label>
                                        <YesNoSelector
                                            className="form-select"
                                            id="califSinirubeInput"
                                            register={register('CalificaSINIRUBE', {onChange: (event) => setElementValue('CalificaSINIRUBE', event.target.value)})}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="tipoPobrezaInput" className="form-label">Tipo de
                                            pobreza</label>
                                        <OptionsSelector
                                            className="form-select"
                                            id="tipoPobrezaInput"
                                            options={tiposPobreza}
                                            placeholder={'Seleccione un tipo'}
                                            onChange={handleTipoPobrezaSelected}
                                            value={tipoPobreza}
                                        />
                                    </div>
                                    <When
                                        condition={!currentUser.CalificaSINIRUBE || currentUser.CalificaSINIRUBE === 'S'}>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label htmlFor="pdfSinirubeInput" className="form-label">Adjuntar
                                                SINIRUBE PDF</label>
                                            <ChooseFileButton
                                                label="Adjuntar Calificación o Declaración Jurada"
                                                fileLoaded={pdfSinirube}
                                                setFileLoaded={handlePdfSinirubeLoaded}
                                            />
                                        </div>
                                    </When>
                                </div>
                                <div className="row form-row mt-4">
                                    <div className="col-12 col-md-2 col-lg-2">
                                        <label htmlFor="califSinirubeInput"
                                               className="form-label">Pensión</label>
                                        <YesNoSelector
                                            className="form-select"
                                            id="califSinirubeInput"
                                            register={register('conPension', {onChange: (event) => setElementValue('conPension', event.target.value)})}
                                        />
                                    </div>
                                    <When condition={!currentUser.conPension || currentUser.conPension === 'S'}>
                                        <div className="col-12 col-md-3 col-lg-3">
                                            <label htmlFor="pensionBrutaInput" className="form-label">Pensión
                                                Bruta</label>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text"
                                                      id="pensionBrutaInput-la">&#x20A1;</span>
                                                <input type="number"
                                                       id="pensionBrutaInput"
                                                       className="form-control"
                                                       aria-label="Username"
                                                       {...register('montoPensionBruta', {required: false})}/>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-3 col-lg-3">
                                            <label htmlFor="pensionNetaInput" className="form-label">Pensión
                                                Neta</label>
                                            <div className="input-group mb-3">
                                            <span className="input-group-text"
                                                  id="pensionNetaInput-la">&#x20A1;</span>
                                                <input type="number"
                                                       id="pensionNetaInput"
                                                       className="form-control"
                                                       aria-label="Username"
                                                       {...register('montoPensionNeta', {required: false})}/>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label htmlFor="pdfpensionInput"
                                                   className="form-label">
                                                Adjuntar Pensión PDF
                                            </label>
                                            <ChooseFileButton
                                                label="Adjuntar Calificación o Declaración Jurada"
                                                fileLoaded={pdfPension}
                                                setFileLoaded={handlePdfPensionLoaded}
                                            />
                                        </div>
                                    </When>
                                </div>
                                <div className="row form-row mt-4">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="nameInput" className="form-label">Aporte Familiar</label>
                                        <YesNoSelector
                                            className="form-select"
                                            id="nameInput"
                                            register={register('conAporteFamiliar', {onChange: (event) => setElementValue('conAporteFamiliar', event.target.value)})}
                                        />
                                    </div>
                                    <When
                                        condition={!currentUser.conAporteFamiliar || currentUser.conAporteFamiliar === 'S'}>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label htmlFor="fisrtLastName"
                                                   className="form-label">
                                                Monto Familiar
                                            </label>
                                            <div className="input-group mb-3">
                                            <span className="input-group-text"
                                                  id="pensionNetaInput-la">&#x20A1;</span>
                                                <input type="number"
                                                       id="pensionNetaInput"
                                                       className="form-control"
                                                       id="fisrtLastName"
                                                       {...register('montoAporteFamiliar', {required: false})}/>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label htmlFor="secondLastName" className="form-label">Observación Monto
                                                Familiar</label>
                                            <input type="text"
                                                   className="form-control"
                                                   id="secondLastName"
                                                   {...register('ObserAporteFamiliar', {required: false})}/>
                                        </div>
                                    </When>
                                </div>
                                <div className="row form-row mt-4">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="nameInput" className="form-label">Otros Ingresos</label>
                                        <YesNoSelector
                                            className="form-select"
                                            id="nameInput"
                                            register={register('conOtrosIngresos', {onChange: (event) => setElementValue('conOtrosIngresos', event.target.value)})}
                                        />
                                    </div>
                                    <When
                                        condition={!currentUser.conOtrosIngresos || currentUser.conOtrosIngresos === 'S'}>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label htmlFor="fisrtLastName"
                                                   className="form-label">
                                                Monto de Otro
                                            </label>
                                            <div className="input-group mb-3">
                                            <span className="input-group-text"
                                                  id="pensionNetaInput-la">&#x20A1;</span>
                                                <input type="number"
                                                       id="pensionNetaInput"
                                                       className="form-control"
                                                       {...register('montoOtrosIngresos', {required: false})}/>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <label htmlFor="secondLastName"
                                                   className="form-label">
                                                Observación Monto de Otro
                                            </label>
                                            <input type="text"
                                                   className="form-control"
                                                   id="secondLastName"
                                                   {...register('ObserOtrosIngresos', {required: false})}/>
                                        </div>
                                    </When>
                                </div>
                                <div className="row form-row mt-5">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="emailRepresentanteInput" className="form-label">Fecha de
                                            Nacimiento</label>
                                        <input type="date" className="form-control" id="emailRepresentanteInput"
                                               {...register('fechaNacimiento', {required: true})}/>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="escolaridadInput"
                                               className="form-label">Escolaridad</label>
                                        <OptionsSelector
                                            className="form-select"
                                            id="escolaridadInput"
                                            options={nivelesAcademicos}
                                            placeholder={'Seleccione un nivel'}
                                            onChange={handlenivelAcademicoSelected}
                                            value={nivelAcademico}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="sexoInput" className="form-label">Estado Civil</label>
                                        <OptionsSelector
                                            className="form-select"
                                            id="sexoInput"
                                            options={estadosCiviles}
                                            placeholder={'Seleccione un estado civil'}
                                            onChange={handleEstadoCivilSelected}
                                            value={estadoCivil}
                                        />
                                    </div>
                                </div>
                                <div className="row form-row mt-4">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="sexoInput" className="form-label">Sexo</label>
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
                                            id="sexoInput"
                                            options={listaNacionalidades}
                                            placeholder={'Seleccione una nacionalidad'}
                                            onChange={handleNacionalidadSelected}
                                            value={nacionalidad}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="gradoDepInput" className="form-label">Grado de
                                            Dependencia</label>
                                        <OptionsSelector
                                            className="form-select"
                                            id="gradoDepInput"
                                            options={gradosDependencia}
                                            placeholder={'Seleccione un grado de dependencia'}
                                            onChange={handleGradoDepSelected}
                                            value={gradoDependencia}
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
                                <div className="mt-4">
                                    <label
                                        htmlFor="direccionTextarea"
                                        className="form-label">
                                        Dirección Exacta
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="direccionTextarea"
                                        rows="3"
                                        {...register('direccionExacta', {required: false})}
                                    />
                                </div>
                                <div
                                    className="d-flex justify-content-center align-items-center flex-column mt-5">
                                    <EditableMapComponent
                                        onMarkerChange={(coords) => setLatLng(coords)}
                                        editable={true}
                                        marker={marker}
                                    />
                                    <p className="text-muted mt-3">Arrastre el marcador para seleccionar una
                                        posición en el mapa</p>
                                </div>
                                <div className="d-flex justify-content-center mt-5 gap-5">
                                    <FormBackButton
                                        navigate={navigate}
                                    />
                                    <FlatButton
                                        label="Siguiente"
                                        btnStyle="primary"
                                        onclick={() => setFase('II')}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div hidden={fase === 'I'}>
                        <div className="row form-row mt-4">
                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="califSinirubeInput" className="form-label">Ley 7972</label>
                                <YesNoSelector
                                    className="form-select"
                                    id="califSinirubeInput"
                                    register={register('calificaLey7972', {onChange: (event) => setElementValue('calificaLey7972', event.target.value)})}
                                />
                            </div>
                        </div>
                        <When condition={!currentUser.calificaLey7972 || currentUser.calificaLey7972 === 'S'}>
                            <div className="row form-row mt-4">
                                <ModalidadSelector
                                    name={'Ley7972'}
                                    sources={modalities}
                                    sourceSelected={sourceSelected}
                                    onSourceSelected={handleSourceSelected}
                                    position={'start'}
                                />
                            </div>
                        </When>

                        <div className="row form-row mt-4">
                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="califSinirubeInput" className="form-label">Ley 9188</label>
                                <YesNoSelector
                                    className="form-select"
                                    id="califSinirubeInput"
                                    register={register('calificaLey9188', {onChange: (event) => setElementValue('calificaLey9188', event.target.value)})}
                                />
                            </div>
                        </div>
                        <When condition={!currentUser.calificaLey9188 || currentUser.calificaLey9188 === 'S'}>
                            <div className="row form-row mt-4">
                                <ModalidadSelector
                                    name={'Ley9188'}
                                    sources={modalities}
                                    sourceSelected={sourceSelected}
                                    onSourceSelected={handleSourceSelected}
                                    position={'start'}
                                />
                            </div>
                        </When>
                        <div className="d-flex justify-content-center mt-5 gap-5">
                            <FlatButton
                                label="ATRÁS"
                                btnStyle="info"
                                onclick={() => setFase('I')}
                                icon={iconBack}
                                iconPosition={'start'}
                            />
                            <FlatButton
                                label="REGISTRAR"
                                btnStyle="primary"
                                type={'submit'}
                            />
                        </div>
                    </div>
                </form>
            </div>

        </CommonLayout>
    );
};

export default RegisterOrganizationPage;