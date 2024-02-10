import React, {useEffect, useRef, useState} from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate, useParams} from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {modifyLey, getLeyes} from '@/server/api';
import useApi from '../../../App/hooks/useApi';
import {useSelector} from 'react-redux';

const EditLawPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [lawsList, setLawsList] = useState(useSelector(state => state?.lawsPage?.lawsList));
    const [currentLaw, setCurrentLaw] = useState();
    const api = useApi();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm({
        defaultValues: React.useMemo(() => {
            return currentLaw;
        }, [currentLaw])
    });

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
            reset(law);
        }
    }, [loaded, lawsList, params]);

    const handleEdit = async (data) => {

        const body = {
            ...data,
            estado: "A"
        };

        await api.request(modifyLey, body).then(
            () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Actualiación exitosa',
                    text: 'La ley ha sido modificada.',
                    button: 'Continuar'
                }).then(
                    () => navigate('/leyes')
                );
            }
        );
    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Editar Ley</h2>
                </div>
                <form onSubmit={handleSubmit(handleEdit)}>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="lawNameInput" className="form-label">Nombre de Ley</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lawNameInput"
                                required
                                {...register('nombreLey', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="lawNumberInput" className="form-label">Número de Ley</label>
                            <input
                                type="number"
                                className="form-control"
                                id="lawNumberInput"
                                {...register('numeroLey', {required: true})}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="lawPercentageInput" className="form-label">Porcentaje</label>
                            <div className="input-group mb-3">
                                <input
                                    type='number'
                                    min={"0"}
                                    max={"100"}
                                    step={"0.1"}
                                    className='form-control'
                                    id='lawPercentageInput'
                                    {...register('porcentajeMonetario', {required: true})}/>
                                <span className="input-group-text" id="basic-addon1">%</span>
                            </div>
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12">
                            <label htmlFor="lawDescription" className="form-label">Descripcion</label>
                            <textarea
                                className="form-control"
                                id="lawDescriptionInput"
                                rows={3}
                                {...register('descripcion', {required: true})}/>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-5 gap-5">
                        <FormBackButton
                            navigate={navigate}/>

                        <FlatButton
                            label="ACTUALIZAR"
                            btnStyle="primary"
                            type="submit"
                        />
                    </div>


                </form>
            </div>

        </CommonLayout>
    );
};

export default EditLawPage;