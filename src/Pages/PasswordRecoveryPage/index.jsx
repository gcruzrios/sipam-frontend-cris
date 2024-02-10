import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import bg from '../../assets/images/loginBackground.jpeg';
import lockIcon from '../../assets/images/lockIcon.svg';
import {LoginCard} from '@/Components/Cards/LoginCard';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CommonLayout from '../../Containers/CommonLayout';
import useApi from '../../App/hooks/useApi';
import {getToken, recoveryPassword, resetNewPassword} from '@/server/api';
import {IfElse} from '@/utils/util';


const PasswordRecoveryPage = () => {
    const navigate = useNavigate();
    const api = useApi();
    const PASSWORD_RECOVERY = 'PASSWORD_RECOVERY';
    const PASSWORD_CHANGE = 'PASSWORD_CHANGE';
    const MySwal = withReactContent(Swal);

    const [currentForm, setCurrentForm] = useState(PASSWORD_RECOVERY);

    const {
        register,
        handleSubmit,
        formState: {errors},
        setError
    } = useForm();

    const showChangePassForm = () => {
        setCurrentForm(PASSWORD_CHANGE);
    };

    const showRecoveryForm = () => {
        setCurrentForm(PASSWORD_RECOVERY);
    };

    const handleRecovery = (data) => {
        // TODO : Request BE to send data
        // Simulate a login process
        const {user} = data;

        const body = {
            correo: user
        };

        api.request(getToken).then(
            async (data) => {
                if (data && data.CodRespuesta === '00') {
                    const token = data.Token;
                    api.request(recoveryPassword, body, token).then(
                        (data) => {
                            if (data && data.outCodigo === '200') {
                                MySwal.fire({
                                    title: 'Correo enviado.',
                                    text: 'Por favor verifique el correo y siga las instrucciones para restablecer su contraseña',
                                    icon: 'success',
                                    confirmButtonText: 'Regresar'
                                }).then(() => {
                                    showChangePassForm();
                                });
                            } else {
                                MySwal.fire({
                                    title: 'Error.',
                                    text: 'Por favor verifique el correo ingresado',
                                    icon: 'error',
                                    confirmButtonText: 'Regresar'
                                }).then();
                            }
                        }
                    );
                }
            });
    };

    const handlePasswordChange = (data) => {
        // TODO : Request BE to send data
        const {correo, claveActual, newPassword, newPasswordVerify} = data;

        if( newPassword !== newPasswordVerify) {
            setError('newPasswordVerify', {type: 'validate', message:'Las contraseñas no coinciden'});
            return;
        }

        const body = {
            correo,
            claveActual,
            claveNueva: newPassword
        };

        api.request(getToken).then(
            async (data) => {
                if (data && data.CodRespuesta === '00') {
                    const token = data.Token;
                    api.request(resetNewPassword, body, token).then(
                        (data) => {
                            if (data && data.outCodigo === '200') {
                                MySwal.fire({
                                    title: 'Cambio exitoso.',
                                    text: 'Ya puedes ingresar con la nueva contraseña',
                                    icon: 'success',
                                    confirmButtonText: 'Regresar'
                                }).then(() => {
                                    navigate('/logout');
                                });
                            } else {
                                MySwal.fire({
                                    title: 'Error.',
                                    text: 'Por favor verifique los datos ingresados',
                                    icon: 'error',
                                    confirmButtonText: 'Regresar'
                                }).then();
                            }
                        }
                    );
                }
            });


    };

    const FormPasswordRecovery = () => {
        return (
            <form onSubmit={handleSubmit(handleRecovery)}>
                <div className="content row justify-content-center px-5 pt-0 pb-5">
                    <div className="col col-5">
                        <img src={lockIcon} alt="Logo recuperar contraseña"/>
                    </div>
                    <div>
                        <h2 className="heading">¿Tienes problemas para iniciar sesión?</h2>
                        <p className="text-body-secondary">
                            Ingresa tu correo electrónico, teléfono o nombre de usuario y te enviaremos un enlace para
                            que recuperes tu cuenta.
                        </p>
                    </div>
                    <div className="mx-1">
                        <input
                            type="text"
                            className="form-control"
                            id="emailInput"
                            aria-describedby="emailHelp"
                            placeholder="Correo electrónico, teléfono o usuario"
                            {...register('user', {required: true})}
                        />
                        {errors.user && <span className="text-danger">Este campo es obligatorio</span>}
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">
                            Enviar
                        </button>

                        <button type="button" className="btn btn-light w-100 mt-3" onClick={() => showChangePassForm()}>
                            Ya tengo un código temporal
                        </button>
                    </div>
                </div>
            </form>
        );
    };

    const FormPasswordChange = () => {
        return (
            <form onSubmit={handleSubmit(handlePasswordChange)}>
                <div className="content row justify-content-center px-5 pt-0 pb-5">
                    <div className="col col-3">
                        <img src={lockIcon} alt="Logo recuperar contraseña"/>
                    </div>
                    <div>
                        <h3 className="heading">Usa el código temporal para cambiar la contraseña.</h3>
                    </div>
                    <div className="mx-1 mt-3">
                        <label htmlFor={'emailInput'}>Correo</label>
                        <input
                            type="text"
                            className="form-control"
                            id="emailInput"
                            aria-describedby="emailHelp"
                            placeholder="Correo electrónico"
                            {...register('correo', {required: true})}
                        />
                        {errors.correo && <span className="text-danger">Este campo es obligatorio</span>}
                    </div>
                    <div className="mx-1 mt-3">
                        <label htmlFor={'tempCodInput'}>Código temporal</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tempCodInput"
                            placeholder="Código Temporal"
                            {...register('claveActual', {required: true})}
                        />
                        {errors.claveActual && <span className="text-danger">Este campo es obligatorio</span>}
                    </div>
                    <div className="mx-1 mt-3">
                        <label htmlFor={'newPasswordInput'}>Nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newPasswordInput"
                            placeholder="Nueva Contraseña"
                            {...register('newPassword', {required: true})}
                        />
                        {errors.newPassword && <span className="text-danger">Este campo es obligatorio</span>}
                    </div>
                    <div className="mx-1 mt-3">
                        <label htmlFor={'newPasswordVerify'}>Verifique la nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newPasswordVerify"
                            placeholder="Verifique la Nueva Contraseña"
                            {...register('newPasswordVerify', {required: true})}
                        />
                        {errors.newPasswordVerify && <span className="text-danger">{errors.newPasswordVerify.message || 'Este campo es obligatorio'}</span>}
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">
                            Cambiar contraseña
                        </button>
                        <button type="button" className="btn btn-light w-100 mt-3" onClick={() => showRecoveryForm()}>
                            Regresar
                        </button>
                    </div>
                </div>
            </form>
        );
    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="container-fluid content-wrapper row p-sm-1 justify-content-center m-0">
                <div className="col col-sm-10 col-md-7 col-lg-5 col-xxl-6 m-md-5 m-sm-3">
                    <LoginCard size="medium">
                        <IfElse condition={currentForm === PASSWORD_RECOVERY} then={
                            <FormPasswordRecovery/>
                        }>
                            <FormPasswordChange/>
                        </IfElse>

                    </LoginCard>

                </div>
            </div>
        </CommonLayout>
    );
};

export default PasswordRecoveryPage;
