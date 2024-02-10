import React, {useState} from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate} from 'react-router-dom';
import {ModalidadSelector} from '@/Components/OptionsChooser/ModalidadSelector';
import {FormBackButton} from '@/Components/Buttons/FormBackButtom';
import {useSelector} from 'react-redux';
import useApi from '../../../App/hooks/useApi';
import {agregarRecurso, getLeyes} from '@/server/api';
import {isEmpty} from 'ramda';
import OptionsSelector from '@/Components/Fields/OptionsSelector';
import {getProgramas} from '@/utils/util';

const RegisterResourcePage = () => {
    const navigate = useNavigate();
    const api = useApi();

    const [leyes, setLeyes] = useState([]);
    const [ley, setLey] = useState('');

    React.useEffect(() => {
        api.request(getLeyes).then(
            result => {
                if (!isEmpty(result.Resultado)) {
                    const listaLeyes = result.Resultado;
                    const leyes = listaLeyes.map(
                        l => ({
                            id: l.idLey,
                            value: l.nombreLey
                        })
                    )
                    setLeyes(leyes);
                }
            }
        );
    }, []);

    const listaProgramas = getProgramas(useSelector);
    const [programa, setPrograma] = useState('');

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const handleRegister = (data) => {
        const body = {
            idLey: ley,
            idPrograma: programa,
            pModalidades: sourceSelected,
            ...data
        };
        api.request(agregarRecurso, body).then(
            async response => {
                if (response.outCodigo !== '200') {
                    const message = response.outMensaje;
                    await Swal.fire({
                        icon: 'error',
                        title: 'Ha sucedido un error al registrar los datos del PAM',
                        text: `${message}. Revise los datos ingresados e intente de nuevo.`,
                        button: 'Regresar'
                    });
                    return;
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'El recurso ha sido registrado.',
                    button: 'Continuar'
                }).then(
                    () => navigate('/recursos')
                );
            }
        );

    };

    const [sourceSelected, setSourceSelected] = useState('1');
    const modalities = useSelector(state => state.root.modalidades);

    const handleSourceSelected = (source) => {
        setSourceSelected(source);
    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Crear Recursos</h2>
                </div>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="yearInput" className="form-label">Año</label>
                            <input type="year"
                                   className="form-control"
                                   id="yearInput"
                                   {...register('annioRecurso', {required: true})}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="lawInput" className="form-label">Ley</label>
                            <OptionsSelector
                                className="form-select"
                                id="lawsInput"
                                options={leyes}
                                placeholder={'Seleccione una ley'}
                                onChange={({target}) => setLey(target.value)}
                                value={ley}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="programInput" className="form-label">Programa</label>
                            <OptionsSelector
                                className="form-select"
                                id="lawsInput"
                                options={listaProgramas}
                                placeholder={'Seleccione un programa'}
                                onChange={({target}) => setPrograma(target.value)}
                                value={programa}
                            />
                        </div>
                    </div>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="amountInput" className="form-label">Monto</label>
                            <div className="input-group mb-3">
                                                <span className="input-group-text"
                                                      id="pensionBrutaInput-la">&#x20A1;</span>
                                <input type="number"
                                       id="pensionBrutaInput"
                                       className="form-control"
                                       aria-label="Username"
                                       {...register('montoRecurso', {required: true})}/>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="resourceNameInput" className="form-label">Nombre de Recurso</label>
                            <input type="text"
                                   className="form-control"
                                   id="resourceNameInput"
                                   {...register('nombreRecurso', {required: true})}
                            />
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <label htmlFor="modalidadInput" className="form-label">Modalidad</label>
                        <ModalidadSelector
                            sources={modalities}
                            sourceSelected={sourceSelected}
                            onSourceSelected={handleSourceSelected}
                            position={'start'}
                            multi
                        />
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

export default RegisterResourcePage;