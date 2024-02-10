import React, {useEffect, useRef, useState} from 'react';
import CommonLayout from '../../../Containers/CommonLayout';
import bg from '../../../assets/images/indexBackground.png';
import {useNavigate, useParams} from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {ModalidadSelector} from '@/Components/OptionsChooser/ModalidadSelector';
import useApi from "../../../App/hooks/useApi";
import {useSelector} from "react-redux";
import {getListadoPAM, getOrganizacionByCedula} from '@/server/api';
import {MapWithMarkers} from '@/Components/Maps/MapWithMarkers';
import Swal from 'sweetalert2';
import {
    getEstadoCivilById,
    getGeneroById, getGradosDependenciaById,
    getLatLngFromGeolocation, getNacionalidadById, getNivelAcademicoById,
    getTipoIdentificacionById, getTipoPobrezaById,
    getTiposIdentificacion, IfElse, When
} from '@/utils/util';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {ChooseFileButton} from '@/Components/Buttons/ChooseFileButton';
import {Loader} from 'semantic-ui-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {empty, isEmpty} from 'ramda';

const ShowPamPage = () => {
    const navigate = useNavigate();
    const api = useApi();
    const params = useParams();
    const isAppReady = useSelector(state => state.root?.isAppReady);

    const [markers, setMarkers] = useState([]);
    const [currentPam, setCurrentPam] = useState();

    const loaded = useRef(false);

    useEffect(() => {
        if(isAppReady &&!currentPam && !loaded.current) {
            loaded.current = true;
            api.request(getListadoPAM, {cedula: params.id}).then(
                data => {
                    if (data && data.Resultado && data.Resultado[0]) {
                        const pam = data.Resultado[0];
                        setCurrentPam(pam);
                        if (pam.geolocalizacion) {
                            const latLng = getLatLngFromGeolocation(pam.geolocalizacion);
                            const markers = [{
                                position: latLng,
                                name: pam.nombre
                            }];
                            setMarkers(markers);
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            text: 'No se ha encontrado la persona.',
                            button: 'Regresar'
                        }).then(
                            () => navigate(-1)
                        );
                    }
                }
            );
        }
    }, [isAppReady]);

    const showFile = (docUrl) => {
        window.open(docUrl, '_blank')
    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <IfElse condition={!currentPam} then={<Loader/>}>
                <div className='bg-light flex-fill p-5'>
                    <div className='form-header'>
                        <h2>Persona Adulta Mayor</h2>
                    </div>
                    <div className='mb-5'>
                        <h4>{`${currentPam?.nombre} ${currentPam?.primerApellido} ${currentPam?.segundoApellido}`}</h4>
                    </div>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Tipo de Identificación</h5>
                            <p>{getTipoIdentificacionById(useSelector, currentPam?.idTipoIdentificacion)}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Número de Identificación</h5>
                            <p>{currentPam?.identificacion}</p>
                        </div>
                    </div>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Califica SINIRUBE</h5>
                            <p>{currentPam?.CalificaSINIRUBE === 'S' ? 'Si' : 'No' }</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Tipo de Pobreza</h5>
                            <p>{getTipoPobrezaById(currentPam?.idIndiceProbreza)}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <When
                                condition={currentPam?.CalificaSINIRUBE === 'S' && !isEmpty(currentPam?.PDF_SINIRUBE)}>
                                <h5>SINIRUBE PDF</h5>
                                <div className="d-flex flex-row justify-content-between rounded-1 flex-row px-0 bg-primary text-light fs-6 ">
                                    <span className="d-flex align-items-center text-wrap"><AttachFileIcon fontSize="small"/>Archivo cargado</span>
                                    <div >
                                        <IconButton aria-label="borrar"
                                                    size="small"
                                                    className="text-light"
                                                    onClick={() => showFile(currentPam?.PDF_SINIRUBE)}>
                                            <VisibilityIcon fontSize="medium"/>
                                        </IconButton>
                                    </div>
                                </div>
                            </When>
                        </div>
                    </div>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-2 col-lg-2'>
                            <h5>Pensión</h5>
                            <p>{currentPam?.conPension === 'S' ? 'Si' : 'No' }</p>
                        </div>
                        <When condition={currentPam?.conPension === 'S'}>
                            <div className="col-12 col-md-3 col-lg-3">
                                <h5>Pensión Bruta</h5>
                                <p>&#x20A1; {currentPam?.montoPensionBruta}</p>
                            </div>
                            <div className="col-12 col-md-3 col-lg-3">
                                <h5>Pensión Neta</h5>
                                <p>&#x20A1; {currentPam?.montoPensionNeta}</p>
                            </div>
                            <When condition={!isEmpty(currentPam?.PDF_PENSION)}>
                                <div className="col-12 col-md-3 col-lg-3">
                                    <h5>Pensión PDF</h5>
                                    <div className="d-flex flex-row justify-content-between rounded-1 flex-row px-0 bg-primary text-light fs-6 ">
                                        <span className="d-flex align-items-center text-wrap"><AttachFileIcon fontSize="small"/>Archivo cargado</span>
                                        <div >
                                            <IconButton aria-label="borrar"
                                                        size="small"
                                                        className="text-light"
                                                        onClick={() => showFile(currentPam?.PDF_PENSION)}>
                                                <VisibilityIcon fontSize="medium"/>
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </When>

                        </When>
                    </div>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Aporte familiar</h5>
                            <p>{currentPam?.conAporteFamiliar === 'S' ? 'Si' : 'No' }</p>
                        </div>
                        <When condition={currentPam?.conAporteFamiliar === 'S'}>
                            <div className="col-12 col-md-3 col-lg-3">
                                <h5>Monto Familiar</h5>
                                <p>&#x20A1; {currentPam?.montoAporteFamiliar}</p>
                            </div>
                            <div className="col-12 col-md-3 col-lg-3">
                                <h5>Observación Monto Familiar</h5>
                                <p>{currentPam?.ObserAporteFamiliar}</p>
                            </div>
                        </When>
                    </div>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Otros Ingresos</h5>
                            <p>{currentPam?.conOtrosIngresos === 'S' ? 'Si' : 'No' }</p>
                        </div>
                        <When condition={currentPam?.conOtrosIngresos === 'S'}>
                            <div className="col-12 col-md-3 col-lg-3">
                                <h5>Monto de Otro</h5>
                                <p>&#x20A1; {currentPam?.montoOtrosIngresos}</p>
                            </div>
                            <div className="col-12 col-md-3 col-lg-3">
                                <h5>Observación Monto de Otro</h5>
                                <p>&{currentPam?.ObserOtrosIngresos}</p>
                            </div>
                        </When>
                    </div>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Fecha de Nacimiento</h5>
                            <p>{currentPam?.fechaNacimiento ? new Date(currentPam?.fechaNacimiento).toDateString() : ''}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Escolaridad</h5>
                            <p>{getNivelAcademicoById(useSelector, currentPam?.idEstadoCivil)}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Estado Civil</h5>
                            <p>{getEstadoCivilById(currentPam?.idEstadoCivil)}</p>
                        </div>
                    </div>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Sexo</h5>
                            <p>{getGeneroById(useSelector, currentPam?.idGenero)}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Nacionalidad</h5>
                            <p>{getNacionalidadById(useSelector, currentPam?.idNacionalidad)}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Grado de Dependencia</h5>
                            <p>{getGradosDependenciaById(useSelector, currentPam?.idGradoDependencia)}</p>
                        </div>
                    </div>
                    <div className='row form-row mt-5'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Provincia</h5>
                            <p>{currentPam?.provincia}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Cantón</h5>
                            <p>{currentPam?.canton}</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <h5>Distrito</h5>
                            <p>{currentPam?.distrito}</p>
                        </div>
                    </div>

                    {markers && markers.length > 0 && (
                        <div className='d-flex justify-content-center align-items-center flex-column mt-5'>
                            <MapWithMarkers
                                markers={markers}/>
                        </div>
                    )}


                    <div className='d-flex justify-content-center mt-5 gap-5'>
                        <FormBackButton
                            navigate={navigate}/>
                    </div>
                </div>
            </IfElse>
        </CommonLayout>
    );
};

export default ShowPamPage;