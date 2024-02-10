import React, {useEffect, useMemo, useState} from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import {SearchField} from '@/Components/Fields/SearchField';
import {MapWithMarkers} from '@/Components/Maps/MapWithMarkers';
import {useSelector} from 'react-redux';
import {asyncDebounce, getLatLngFromGeolocation, wait, When} from '@/utils/util';
import fuzzysort from 'fuzzysort';
import * as R from 'ramda';
import {equals} from 'ramda';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate} from 'react-router-dom';
import {getUserRole} from '@/App/hooks/useAuth';
import {ROLE_ADMIN, ROLE_ORG} from '@/store/model';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {Button, Link, SvgIcon} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

const GeolocationPage = () => {
    const [markers, setMarkers] = useState([]);
    const geolocationList = useSelector(state => state?.geolocationPage?.geoList) || [];
    const [dataOptions, setDataOptions] = useState([]);
    const [markerSelected, setMarkerSelected] = useState(null);
    const infoBox = React.useRef();
    const navigate = useNavigate();
    const [dataType, setDataType] = useState('PAM');
    const userRole = useMemo(() => getUserRole(), []);
    const iconPlus = <FontAwesomeIcon icon={faPlus}/>;

    useEffect(() => {
        if (geolocationList.length !== 0) {
            if (equals(userRole, ROLE_ADMIN)) {
                if (dataType === 'PAM') {
                    const markerList = geolocationList[0].map(
                        m => {
                            const latLng = getLatLngFromGeolocation(m.geolocalizacion);
                            const marker = {
                                position: latLng,
                                name: m.nombre,
                                data: m
                            };
                            return marker;
                        }
                    );
                    setMarkers(markerList);
                } else {
                    const markerList = geolocationList[1].map(
                        m => {
                            const latLng = getLatLngFromGeolocation(m.geoLocalizacion);
                            const marker = {
                                position: latLng,
                                name: m.razonSocial,
                                data: m
                            };
                            return marker;
                        }
                    );
                    setMarkers(markerList);
                }
            } else {
                const markerList = geolocationList.map(
                    m => {
                        const latLng = getLatLngFromGeolocation(m.geolocalizacion);
                        const marker = {
                            position: latLng,
                            name: m.nombre,
                            data: m
                        };
                        return marker;
                    }
                );
                setMarkers(markerList);
            }

        }
    }, [geolocationList, dataType]);

    const names = React.useMemo(() => {
        if (!geolocationList || !userRole) return [];
        if (equals(userRole, ROLE_ADMIN)) {
            if (!geolocationList[0]) return [];
            if (dataType === 'PAM') {
                return R.map(m => m.nombre, geolocationList[0]);
            }
            return R.map(m => m.razonSocial, geolocationList[1]);
        }
        return R.map(m => m.nombre, geolocationList);
    }, [geolocationList, dataType, userRole]);

    const handleSearch = asyncDebounce(event => {
        const search = event.target.value;
        const result = fuzzysort.go(search, names);
        const resultList = R.map(result => result.target, result);
        if (equals(userRole, ROLE_ADMIN)) {
            if (dataType === 'PAM') {
                const list = R.filter(m => R.includes(m.nombre, resultList), geolocationList[0]);
                const markerList = list.map(
                    m => {
                        const latLng = getLatLngFromGeolocation(m.geolocalizacion);
                        const marker = {
                            position: latLng,
                            name: m.nombre,
                            data: m
                        };
                        return marker;
                    }
                );
                setMarkers(markerList);
                setDataOptions(resultList);
            } else {
                const list = R.filter(m => R.includes(m.razonSocial, resultList), geolocationList[1]);
                const markerList = list.map(
                    m => {
                        const latLng = getLatLngFromGeolocation(m.geoLocalizacion);
                        const marker = {
                            position: latLng,
                            name: m.razonSocial,
                            data: m
                        };
                        return marker;
                    }
                );
                setMarkers(markerList);
                setDataOptions(resultList);
            }
        } else {
            const list = R.filter(m => R.includes(m.nombre, resultList), geolocationList);
            const markerList = list.map(
                m => {
                    const latLng = getLatLngFromGeolocation(m.geolocalizacion);
                    const marker = {
                        position: latLng,
                        name: m.nombre,
                        data: m
                    };
                    return marker;
                }
            );
            setMarkers(markerList);
            setDataOptions(resultList);
        }
    }, 500);

    const handleMarkerClick = ({marker}) => {
        console.log('=>(index.jsx:144) marker', marker);
        setMarkerSelected(marker);
        wait(500).then(() => {
            scrollToBottom();
        });
    };

    const scrollToBottom = () => {
        infoBox.current.scrollIntoView({behavior: 'smooth'});
    };

    const handleDataTypeSelect = (event) => {
        const value = event.target.value;
        setDataType(value);
    };

    return (
        <CommonLayout>
            <div className="bg-light flex-fill p-5">
                <div className="d-flex flex-column">
                    <h2>Geolocalización</h2>
                    <div className="row mt-5 gap-3">
                        <When condition={equals(userRole, ROLE_ADMIN)}>
                            <div className="col col-auto d-flex">
                                <div>
                                    <label htmlFor="tipo-dato" className="col-form-label">Tipo de dato</label>
                                    <select id={'tipo-dato'}
                                            className={'form-select'}
                                            placeholder={'Seleccione un tipo de dato'}
                                            onChange={handleDataTypeSelect}>
                                        <option value={'PAM'}>PAM</option>
                                        <option value={'OBS/GL'}>OBS/GL</option>
                                    </select>
                                </div>
                            </div>
                        </When>
                        <div className="col col-auto d-flex">
                            <div>
                                <label htmlFor="search-field"
                                       className="col-form-label">{`Filtrar por nombre de ${dataType}`}</label>
                                <SearchField
                                    id={'search-field'}
                                    onChange={handleSearch}
                                    placeholder="Digita un nombre"
                                    style="dark"
                                    options={dataOptions}
                                />
                            </div>
                        </div>
                        <When condition={equals(userRole, ROLE_ORG)}>
                            <div className="col d-flex flex-row-1">
                                <div className="ms-auto my-auto">
                                    <FlatButton
                                        label="NUEVO"
                                        btnStyle="primary"
                                        icon={iconPlus}
                                        iconPosition="end"
                                        onclick={() => navigate('/pam/registrar')}
                                    />
                                </div>
                            </div>
                        </When>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center mt-5">

                    <p className={'text-muted'}>
                        Selecciona un marcador para ver la información del PAM
                    </p>

                    <MapWithMarkers
                        markers={markers}
                        zoom={8}
                        mapContainerStyle={{width: '700px', height: '500px'}}
                        onMarkerClick={handleMarkerClick}
                    />
                </div>
                {markerSelected && markerSelected.data && (
                    <div className="p-3 bg-white border-2 border-black mt-5">
                        <When condition={dataType === 'PAM'}>
                            <div className="row form-row mt-4">
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Nombre</h5>
                                    <p id="lawName">{markerSelected.data?.nombre}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Cédula</h5>
                                    <p id="lawNumber">{markerSelected.data?.identificacion}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center d-none">
                                    <h5>Modalidad</h5>
                                    <p id="lawDescription">{markerSelected.data?.modalidad}</p>
                                </div>
                            </div>
                            <div className="row form-row mt-4">
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Provincia</h5>
                                    <p id="lawName">{markerSelected.data?.provincia}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Cantón</h5>
                                    <p id="lawNumber">{markerSelected.data?.canton}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Distrito</h5>
                                    <p id="lawDescription">{markerSelected.data?.distrito}</p>
                                </div>
                            </div>
                            <div className="row form-row mt-4">
                                <div className="d-flex gap-3 justify-content-center">
                                    <Button variant="outlined"
                                            component={Link}
                                            size="large"
                                            href={`https://waze.com/ul?ll=${markerSelected.position.lat},${markerSelected.position.lng}&z=10`}
                                            target="_blank"
                                            endIcon={
                                                <SvgIcon>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                                                         viewBox="0 0 512 512">
                                                        <path
                                                            d="M502.2 201.7C516.7 287.5 471.2 369.6 389 409.8c13 34.1-12.4 70.2-48.3 70.2a51.7 51.7 0 0 1 -51.6-49c-6.4 .2-64.2 0-76.3-.6A51.7 51.7 0 0 1 159 479.9c-33.9-1.4-58-34.8-47-67.9-37.2-13.1-72.5-34.9-99.6-70.8-13-17.3-.5-41.8 20.8-41.8 46.3 0 32.2-54.2 43.2-110.3C94.8 95.2 193.1 32 288.1 32c102.5 0 197.2 70.7 214.1 169.7zM373.5 388.3c42-19.2 81.3-56.7 96.3-102.1 40.5-123.1-64.2-228-181.7-228-83.5 0-170.3 55.4-186.1 136-9.5 48.9 5 131.4-68.8 131.4C58.2 358.6 91.6 378.1 127 389.5c24.7-21.8 63.9-15.5 79.8 14.3 14.2 1 79.2 1.2 87.9 .8a51.7 51.7 0 0 1 78.8-16.4zM205.1 187.1c0-34.7 50.8-34.8 50.8 0s-50.8 34.7-50.8 0zm116.6 0c0-34.7 50.9-34.8 50.9 0s-50.9 34.8-50.9 0zm-122.6 70.7c-3.4-16.9 22.2-22.2 25.6-5.2l.1 .3c4.1 21.4 29.9 44 64.1 43.1 35.7-.9 59.3-22.2 64.1-42.8 4.5-16.1 28.6-10.4 25.5 6-5.2 22.2-31.2 62-91.5 62.9-42.6 0-80.9-27.8-87.9-64.3z"/>
                                                    </svg>
                                                </SvgIcon>}
                                    >
                                        Waze
                                    </Button>
                                    <Button variant="outlined"
                                            component={Link}
                                            size="large"
                                            href={`https://www.google.com/maps/search/?api=1&query=${markerSelected.position.lat},${markerSelected.position.lng}`}
                                            target="_blank"
                                            endIcon={<MapIcon/>}>
                                        Maps
                                    </Button>
                                </div>
                            </div>
                            <When condition={equals(userRole, ROLE_ORG)}>
                                <div className="row form-row mt-4">
                                    <div className="d-flex justify-content-center mt-5 gap-5">
                                        <FlatButton
                                            label="Ver más"
                                            btnStyle="primary"
                                            onclick={() => navigate(`/pam/ver/${markerSelected.data.identificacion}`)}
                                        />
                                        <FlatButton
                                            label="Editar"
                                            btnStyle="primary"
                                            onclick={() => navigate(`/pam/editar/${markerSelected.data.identificacion}`)}
                                        />
                                    </div>
                                </div>
                            </When>

                        </When>
                        <When condition={dataType === 'OBS/GL'}>
                            <div className="row form-row mt-4">
                                <div className="col-12 col-md-6 col-lg-3 text-center">
                                    <h5>Razón Social</h5>
                                    <p>{markerSelected.data?.razonSocial}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3 text-center">
                                    <h5>Tipo de razón social</h5>
                                    <p>{markerSelected.data?.tipoRazonSocial}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3 text-center">
                                    <h5>Cédula Jurídica</h5>
                                    <p>{markerSelected.data?.identificacion}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3 text-center">
                                    <h5>Código de Institución</h5>
                                    <p>{markerSelected.data?.codigoInstitucion}</p>
                                </div>

                            </div>
                            <div className="row form-row mt-4">
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Provincia</h5>
                                    <p id="lawName">{markerSelected.data?.provincia}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Cantón</h5>
                                    <p id="lawNumber">{markerSelected.data?.canton}</p>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 text-center">
                                    <h5>Distrito</h5>
                                    <p id="lawDescription">{markerSelected.data?.distrito}</p>
                                </div>
                            </div>
                            <div className="row form-row mt-4">
                                <div className="d-flex gap-3 justify-content-center">
                                    <Button variant="outlined"
                                            component={Link}
                                            size="large"
                                            href={`https://waze.com/ul?ll=${markerSelected.position.lat},${markerSelected.position.lng}&z=10`}
                                            target="_blank"
                                            endIcon={
                                                <SvgIcon>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                                                         viewBox="0 0 512 512">
                                                        <path
                                                            d="M502.2 201.7C516.7 287.5 471.2 369.6 389 409.8c13 34.1-12.4 70.2-48.3 70.2a51.7 51.7 0 0 1 -51.6-49c-6.4 .2-64.2 0-76.3-.6A51.7 51.7 0 0 1 159 479.9c-33.9-1.4-58-34.8-47-67.9-37.2-13.1-72.5-34.9-99.6-70.8-13-17.3-.5-41.8 20.8-41.8 46.3 0 32.2-54.2 43.2-110.3C94.8 95.2 193.1 32 288.1 32c102.5 0 197.2 70.7 214.1 169.7zM373.5 388.3c42-19.2 81.3-56.7 96.3-102.1 40.5-123.1-64.2-228-181.7-228-83.5 0-170.3 55.4-186.1 136-9.5 48.9 5 131.4-68.8 131.4C58.2 358.6 91.6 378.1 127 389.5c24.7-21.8 63.9-15.5 79.8 14.3 14.2 1 79.2 1.2 87.9 .8a51.7 51.7 0 0 1 78.8-16.4zM205.1 187.1c0-34.7 50.8-34.8 50.8 0s-50.8 34.7-50.8 0zm116.6 0c0-34.7 50.9-34.8 50.9 0s-50.9 34.8-50.9 0zm-122.6 70.7c-3.4-16.9 22.2-22.2 25.6-5.2l.1 .3c4.1 21.4 29.9 44 64.1 43.1 35.7-.9 59.3-22.2 64.1-42.8 4.5-16.1 28.6-10.4 25.5 6-5.2 22.2-31.2 62-91.5 62.9-42.6 0-80.9-27.8-87.9-64.3z"/>
                                                    </svg>
                                                </SvgIcon>}
                                    >
                                        Waze
                                    </Button>
                                    <Button variant="outlined"
                                            component={Link}
                                            size="large"
                                            href={`https://www.google.com/maps/search/?api=1&query=${markerSelected.position.lat},${markerSelected.position.lng}`}
                                            target="_blank"
                                            endIcon={<MapIcon/>}>
                                        Maps
                                    </Button>
                                </div>
                            </div>
                            <When condition={equals(userRole, ROLE_ADMIN)}>
                                <div className="row form-row mt-4">
                                    <div className="d-flex justify-content-center mt-5 gap-5">
                                        <FlatButton
                                            label="Ver más"
                                            btnStyle="primary"
                                            onclick={() => navigate(`/organizaciones/ver/${markerSelected.data.idOrganizacion}`)}
                                        />
                                        <FlatButton
                                            label="Editar"
                                            btnStyle="primary"
                                            onclick={() => navigate(`/organizaciones/editar/${markerSelected.data.idOrganizacion}`)}
                                        />
                                    </div>
                                </div>
                            </When>

                        </When>

                    </div>
                )}
                <div ref={infoBox}></div>

            </div>
        </CommonLayout>
    );
};

export default GeolocationPage;