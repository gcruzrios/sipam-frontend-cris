import React, {useState} from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate} from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {getListaCantones, getListaDistritos, getListaProvincias, getValueById} from '@/utils/util';
import {useDispatch, useSelector} from 'react-redux';
import {ModalidadSelector} from '@/Components/OptionsChooser/ModalidadSelector';
import OptionsSelector from '../../../Components/Fields/OptionsSelector';
import {agregarOrganizacion, getOrganizacionByCedula} from '@/server/api';
import useApi from '../../../App/hooks/useApi';
import {showAlert} from '@/store/root/actions';
import {EditableMapComponent} from '@/Components/Maps/EditableMap';
import {getLocationCoordinates} from '@/server/googleApi';
import {isEmpty} from 'ramda';

const RegisterOrganizationPage = () => {
    const navigate = useNavigate();
    const api = useApi();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: {errors},
        getValues,
        reset
    } = useForm();

    const [sourceSelected, setSourceSelected] = useState('1');
    const modalities = useSelector(state => state.root.modalidades);

    const [provincia, setProvincia] = useState('');
    const listaProvincias = getListaProvincias(useSelector);

    const [canton, setCanton] = useState('');
    const [listaCantones, setListaCantones] = useState([]);

    const [distrito, setDistrito] = useState('');
    const [listaDistritos, setListaDistritos] = useState([]);

    const latLng = React.useRef({});
    const setLatLng = (coords) => {
        latLng.current = coords;
    };

    const handleRegister = async (data) => {
        if (Object.keys(latLng.current).length === 0) {
            dispatch(showAlert({
                show: true,
                options: {
                    icon: 'error',
                    title: 'Debe seleccionar una ubicación en el mapa'
                }
            }));
            return false;
        }

        const body = {
            ...data,
            razonSocial: null,
            idModalidad: sourceSelected,
            geoLocalizacion: `${latLng.current.lat},${latLng.current.lng}`,
            idDistrito: distrito,
            estado: 'A'
        };
        await api.request(agregarOrganizacion, body).then(
            () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'La organizacion ha sido registrada.',
                    button: 'Continuar'
                }).then(
                    () => navigate('/organizaciones')
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
                            name: currentOrg?.nombreOBS || ''
                        };
                        setMarker(marker);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }

    };

    const [currentOBS, setCurrentOBS] = useState(null);

    const findObs = () => {
        const {cedulaJuridica} = getValues();
        api.request(getOrganizacionByCedula, cedulaJuridica).then(
            async data => {
                if (data && data.Resultado && data.Resultado[0]) {
                    const org = data.Resultado[0];
                    setCurrentOBS(org);
                    const orgData = {
                        codigoInstitucion: org.codigoInstitucion,
                        nombreOBS: org.nombreOBS
                    };
                    reset(orgData);
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
                    <h2>Registrar Organización</h2>
                </div>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="cedulaJuridicaInput" className="form-label">Cédula Juridica</label>
                            <div className="input-group">
                                <input type="text"
                                       className="form-control"
                                       id="cedulaJuridicaInput"
                                       {...register('cedulaJuridica', {required: true})}
                                />
                                <button className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => findObs()}
                                        id="button-find-cedula">
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="nombreObsGlInput" className="form-label">Nombre de OBS/GL</label>
                            <input type="text"
                                   className="form-control"
                                   id="nombreObsGlInput"
                                   {...register('nombreOBS', {required: true})}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="phoneNumberInput" className="form-label">Número de Teléfono</label>
                            <input type="phone"
                                   className="form-control"
                                   id="phoneNumberInput"
                                   {...register('numeroTelefono', {required: true})}
                            />
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="email1Input" className="form-label">Correo Electrónico 1</label>
                            <input type="email"
                                   className="form-control"
                                   id="email1Input"
                                   {...register('correoElectronico1', {required: true})}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="email2Input" className="form-label">Correo Electrónico 2</label>
                            <input type="email"
                                   className="form-control"
                                   id="email2Input"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="codigoObsGlInput" className="form-label">Código OBS/GL</label>
                            <input type="text"
                                   className="form-control"
                                   id="codigoObsGlInput"
                                   {...register('codigoInstitucion', {required: true})}
                            />
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="nombreRepresentanteInput" className="form-label">Nombre Representante
                                Legal</label>
                            <input type="text"
                                   className="form-control"
                                   id="nombreRepresentanteInput"
                                   {...register('nombreRepLegal', {required: true})}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="cedulaRepresentanteInput" className="form-label">Cédula
                                Representante</label>
                            <input type="text"
                                   className="form-control"
                                   id="cedulaRepresentanteInput"
                                   {...register('cedulaRepLegal', {required: true})}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="telefonoRepresentanteInput" className="form-label">Teléfono
                                Representante</label>
                            <input type="phone"
                                   className="form-control"
                                   id="telefonoRepresentanteInput"
                                   {...register('telefonoRepLegal', {required: true})}
                            />
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="emailRepresentanteInput" className="form-label">Correo Electrónico
                                Representante</label>
                            <input type="text"
                                   className="form-control"
                                   id="emailRepresentanteInput"
                                   {...register('correoRepLegal', {required: true})}
                            />
                        </div>
                    </div>
                    <br/>

                    <div className="row form-row mt-5">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="nombreCordinadorInput" className="form-label">Nombre Coordinador
                                Legal</label>
                            <input type="text"
                                   className="form-control"
                                   id="nombreCordinadorInput"
                                   {...register('nombreCordinador', {required: true})}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="cedulaCordinadorInput" className="form-label">Cédula Coordinador</label>
                            <input type="text"
                                   className="form-control"
                                   id="cedulaCordinadorInput"
                                   {...register('cedulaCordinador', {required: true})}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="telefonoCordinadorInput" className="form-label">Teléfono
                                Coordinador</label>
                            <input type="phone"
                                   className="form-control"
                                   id="telefonoCordinadorInput"
                                   {...register('telefonoCordinador', {required: true})}
                            />
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="emailCoordinadorInput" className="form-label">Correo Electrónico
                                Coordinador</label>
                            <input type="text"
                                   className="form-control"
                                   id="emailCoordinadorInput"
                                   {...register('correoCordinador', {required: true})}
                            />
                        </div>
                    </div>

                    <div className="col form-row mt-4">
                        <label className="form-check-label" htmlFor="radioGroupeModalidad">Modalidad</label>
                        <ModalidadSelector
                            sources={modalities}
                            sourceSelected={sourceSelected}
                            onSourceSelected={handleSourceSelected}
                            position={'start'}
                        />
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
                                required
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
                                required
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
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="direccionTextarea" className="form-label">Dirección Exacta</label>
                        <textarea className="form-control"
                                  id="direccionTextarea"
                                  rows="3"
                                  {...register('direccionExacta', {required: true})}/>
                    </div>

                    <div className="d-flex justify-content-center align-items-center flex-column mt-5">
                        <EditableMapComponent
                            onMarkerChange={(coords) => setLatLng(coords)}
                            editable={true}
                        />
                        <p className="text-muted mt-3">Arrastre el marcador para seleccionar una posición en el mapa</p>
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