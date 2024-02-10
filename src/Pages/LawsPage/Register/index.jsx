import React from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import { useForm } from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import { FlatButton } from '@/Components/Buttons/FlatButton';
import { useNavigate } from 'react-router-dom';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {useDispatch} from "react-redux";
import {showAlert} from '@/store/root/actions';
import useApi from '../../../App/hooks/useApi';
import {registrarLey} from '@/server/api';

const RegisterLawPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const api = useApi();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleRegister = async (data) => {
        const {nombreLey, numeroLey, porcentajeMonetario} = data;

        if(!nombreLey || !numeroLey || !porcentajeMonetario) {
            dispatch(showAlert({
                show: true,
                options: {
                    icon: 'error',
                    title: 'Complete el formulario'
                }
            }));
            return;
        }

        if(porcentajeMonetario > 100) {
            dispatch(showAlert({
                show: true,
                options: {
                    icon: 'error',
                    title: 'El porcentaje máximo es 100'
                }
            }));
        }

        await api.request(registrarLey, data ).then(
            () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'La ley ha sido registrada.',
                    button: 'Continuar'
                }).then(
                    () => navigate('/leyes')
                );
            }
        )
    };

    return(
        <CommonLayout style = {{ backgroundImage: `url(${bg})` }}>
            <div className='bg-light flex-fill p-5'>
                <div className='form-header'>
                    <h2>Registro de Leyes</h2>
                </div>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className='row form-row mt-4'>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <label htmlFor='lawNameInput' className='form-label'>Nombre de Ley</label>
                            <input
                                type='text'
                                className='form-control'
                                id='lawNameInput'
                                required
                                {...register('nombreLey', {required: true})}/>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
                            <label htmlFor='lawNumberInput' className='form-label'>Número de Ley</label>
                            <input
                                type='number'
                                className='form-control'
                                id='lawNumberInput'
                                {...register('numeroLey', {required: true})}/>
                        </div>
                        <div className='col-12 col-md-6 col-lg-4'>
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

                    <div className='d-flex justify-content-center mt-5 gap-5'>
                        <FormBackButton
                            navigate={navigate}/>

                        <FlatButton
                            label='REGISTRAR'
                            btnStyle='primary'
                            type='submit'  
                        />
                    </div>
                    


                </form>
            </div>
            
        </CommonLayout>
    );
};

export default RegisterLawPage;