import React, {useEffect, useRef, useState} from 'react';
import CommonLayout from '../../../Containers/CommonLayout';
import bg from '../../../assets/images/indexBackground.png';
import {useNavigate, useParams} from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import useApi from '../../../App/hooks/useApi';
import {getOrganizacionById} from '@/server/api';
import {MapWithMarkers} from '@/Components/Maps/MapWithMarkers';
import Swal from 'sweetalert2';
import {getLatLngFromGeolocation} from '@/utils/util';
import {useSelector} from 'react-redux';

const RegisterOrganizationPage = () => {
    const navigate = useNavigate();
    const api = useApi();
    const params = useParams();

    const [markers, setMarkers] = useState([]);
    const [currentOrg, setCurrentOrg] = useState();
    const isAppReady = useSelector(state => state.root?.isAppReady);

    const loaded = useRef(false);

    useEffect(() => {
        if (isAppReady && !currentOrg && !loaded.current) {
            loaded.current = true;
            api.request(getOrganizacionById, params.id).then(
                data => {
                    if (data && data.Resultado && data.Resultado[0]) {
                        const org = data.Resultado[0];
                        setCurrentOrg(org);
                        if (org.geoLocalizacion) {
                            const latLng = getLatLngFromGeolocation(org.geoLocalizacion);
                            const markers = [{
                                position: latLng,
                                name: org.nombreOBS
                            }];
                            setMarkers(markers);
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            text: 'No se ha encontrado la organización.',
                            button: 'Regresar'
                        }).then(
                            () => navigate('/organizaciones')
                        );
                    }
                }
            );
        }
    }, [isAppReady]);

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Detalle de Organización</h2>
                </div>
                <div className="row form-row mt-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Nombre de OBS/GL</h5>
                        <p>{currentOrg?.nombreOBS}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Número de Teléfono</h5>
                        <p>{currentOrg?.numeroTelefono}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Correo Electrónico 1</h5>
                        <p>{currentOrg?.correoElectronico1}</p>
                    </div>
                </div>
                <div className="row form-row mt-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Correo Electrónico 2</h5>
                        <p>{currentOrg?.correoElectronico2}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Cédula Juridica</h5>
                        <p>{currentOrg?.cedulaJuridica}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Código OBS/GL</h5>
                        <p>{currentOrg?.codigoInstitucion}</p>
                    </div>
                </div>
                <div className="row form-row mt-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Nombre Representante
                            Legal</h5>
                        <p>{currentOrg?.nombreRepLegal}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Cédula
                            Representante</h5>
                        <p>{currentOrg?.cedulaRepLegal}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Teléfono
                            Representante</h5>
                        <p>{currentOrg?.telefonoRepLegal}</p>
                    </div>
                </div>
                <div className="row form-row mt-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Correo Electrónico Representante</h5>
                        <p>{currentOrg?.correoRepLegal}</p>
                    </div>
                </div>
                <br/>

                <div className="row form-row mt-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Nombre Coordinador Legal</h5>
                        <p>{currentOrg?.nombreCordinador}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Cédula Coordinador</h5>
                        <p>{currentOrg?.cedulaCordinador}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Teléfono Coordinador</h5>
                        <p>{currentOrg?.telefonoCordinador}</p>
                    </div>
                </div>
                <div className="row form-row mt-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Correo Electrónico Coordinador</h5>
                        <p>{currentOrg?.correoCordinador}</p>
                    </div>
                </div>

                <div className="col form-row mt-4">
                    <h5>Modalidad</h5>
                    <p>{currentOrg?.modalidadAtencion}</p>
                </div>

                <div className="row form-row mt-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Provincia</h5>
                        <p>{currentOrg?.provincia}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Cantón</h5>
                        <p>{currentOrg?.canton}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Distrito</h5>
                        <p>{currentOrg?.distrito}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <h5>Dirección Exacta</h5>
                    <p>{currentOrg?.direccionExacta}</p>
                </div>

                {markers && markers.length > 0 && (
                    <div className="d-flex justify-content-center align-items-center flex-column mt-5">
                        <MapWithMarkers
                            markers={markers}/>
                    </div>
                )}


                <div className="d-flex justify-content-center mt-5 gap-5">
                    <FormBackButton
                        navigate={navigate}/>
                </div>
            </div>

        </CommonLayout>
    );
};

export default RegisterOrganizationPage;