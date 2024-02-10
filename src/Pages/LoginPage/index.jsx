// src/Index.js
import React, {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import Swal from 'sweetalert2';
import PasswordField from '../../Components/Fields/PasswordField';
import bg from '../../assets/images/loginBackground.jpeg';
import './styles.scss';
import {LoginCard} from '@/Components/Cards/LoginCard';
import useAuth from '../../App/hooks/useAuth';
import useApi from '../../App/hooks/useApi';
import {getToken, getUser as getUserApi} from '../../server/api';
import {saveUser} from '@/store/users/actions';
import CommonLayout from '../../Containers/CommonLayout';
import {catchFetchErrors} from '@/utils/util';
import {showAlert} from '@/store/root/actions';


const Login = () => {
    const dispatch = useDispatch();
    const {login} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const api = useApi();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const handleLogin = async (data) => {
        const {user, password, persist} = data;
        console.log(data);
        try {
            await api.request(getToken).then(
                async (data) => {
                    if (data && data.CodRespuesta === '00') {
                        const token = data.Token;
                       api.request(getUserApi, user, password, token).then(
                           (userDataRequest) => {
                               if (userDataRequest) {
                                   if (userDataRequest && userDataRequest.CodigoResultado === '200') {
                                       const userData = userDataRequest?.Resultado?.[0];
                                       login(userData, token, persist).then(() => {
                                           dispatch(saveUser(userData));
                                           dispatch(showAlert({
                                               show: true,
                                               options: {
                                                   icon: 'success',
                                                   title: 'Ingreso con éxito'
                                               }
                                           }));
                                           navigate(location.state?.from && location.state?.from !== '/logout' ? location.state?.from : '/');
                                       });
                                   } else {
                                       throw {
                                           response: {
                                               status: 201,
                                               message: userDataRequest?.MensajeResultado || 'Usuario o contraseña invalidos'
                                           }
                                       };
                                   }
                               } else {
                                   throw {
                                       response: {
                                           status: 400,
                                           message: 'Ocurrió un error con la solicitud.'
                                       }
                                   };
                               }
                           }
                       ).catch(
                           (error) => {
                               catchFetchErrors(error);
                           }
                       );
                    } else {
                        throw {
                            response: {
                                status: 500
                            }
                        };
                    }
                }
            ).catch(
                (error) => {
                    catchFetchErrors(error);
                }
            );

        } catch (error) {
            catchFetchErrors(error);
        }

    };

    const goToPasswordRecovery = useCallback(() => {
        navigate('/passwordRecovery');
    }, [navigate]);

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="container-fluid content-wrapper row py-4 ps-x-1 p-x-lg-5 m-0">
                <div className="col col-sm-12 col-lg-7 col-xxl-8">
                    <p className="principal-info">
                        Sistema de Información de la Persona Adulta Mayor (SIPAM)
                    </p>
                    <p className="info">
                        Un sistema de registro de personas adultas mayores beneficiarias de CONAPAM.
                    </p>
                </div>
                <div className="col col-sm-12 col-lg-5 col-xxl-4">
                    <LoginCard size="medium">
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <div className="content">
                                <h2 className="heading">Entrar al SIPAM</h2>
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        autoComplete="username"
                                        id="emailInput"
                                        aria-describedby="emailHelp"
                                        placeholder="Usuario"
                                        {...register('user', {required: true})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <PasswordField
                                        id="passwordInput"
                                        placeholder="Contraseña"
                                        labelText="Contraseña"
                                        register={register}
                                        registerField="password"
                                        required
                                    />
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="stayConnectedCheck"
                                            {...register('persist')}
                                        />
                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                            Mantenerme conectado
                                        </label>
                                    </div>
                                    <button type="button" className="btn btn-light" onClick={goToPasswordRecovery}>
                                        ¿Olvidó su contaseña?
                                    </button>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Entrar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </LoginCard>

                </div>
            </div>
        </CommonLayout>
    );
};

export default Login;
