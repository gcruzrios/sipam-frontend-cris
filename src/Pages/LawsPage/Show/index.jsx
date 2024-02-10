import React, {useEffect, useRef, useState} from 'react';
import bg from '../../../assets/images/indexBackground.png';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import CommonLayout from '../../../Containers/CommonLayout';
import {useNavigate, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getLeyes} from '@/server/api';
import Swal from 'sweetalert2';
import useApi from '../../../App/hooks/useApi';

const ShowLaw = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [lawsList, setLawsList] = useState(useSelector(state => state?.lawsPage?.lawsList));
    const [currentLaw, setCurrentLaw] = useState();
    const api = useApi();

    const loaded = useRef(false);

    useEffect(() => {

        if (!loaded.current && !lawsList) {
            loaded.current = true;
            api.request(getLeyes).then(
                data => {
                    if (data && data.Resultado) {
                        setLawsList(data.Resultado);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            text: 'No se ha encontrado la ley.',
                            button: 'Regresar'
                        }).then(
                            () => navigate('/leyes')
                        );
                    }
                }
            );
        }
    }, [loaded, lawsList]);

    useEffect(() => {
        if (lawsList && lawsList.length > 0) {
            const lawId = params.id;
            const law = lawsList.find(law => law.idLey === lawId);
            if (!law) {
                Swal.fire({
                    icon: 'error',
                    text: 'No se ha encontrado la ley.',
                    button: 'Regresar'
                }).then(
                    () => navigate('/leyes')
                );
            }
            setCurrentLaw(law);
        }
    }, [lawsList, params]);


    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Ver Ley</h2>
                </div>
                <div className="row form-row mt-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Nombre de Ley</h5>
                        <p id="lawName">{currentLaw?.nombreLey}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Número de Ley</h5>
                        <p id="lawNumber">{currentLaw?.numeroLey}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5>Porcentaje</h5>
                        <p id="lawDescription">{currentLaw?.porcentajeMonetario} %</p>
                    </div>
                    <div className="col-12">
                        <h5>Descripcion</h5>
                        <p id="lawDescription">{currentLaw?.descripcion}</p>
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-5">
                    <FormBackButton
                        navigate={navigate}/>
                </div>
            </div>

        </CommonLayout>
    );
};

export default ShowLaw;