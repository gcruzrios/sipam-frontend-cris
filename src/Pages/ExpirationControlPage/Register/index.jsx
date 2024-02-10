import React from 'react';
import Swal from 'sweetalert2';
import CommonLayout from '../../../Containers/CommonLayout';
import {useForm} from 'react-hook-form';
import bg from '../../../assets/images/indexBackground.png';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate} from 'react-router-dom';
import {getBase64} from '@/utils/util';
import {Box, Button, Typography} from '@mui/material';

const NewExpirationFilePage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const handleRegister = () => {
        Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'La organizacion ha sido registrada.',
            button: 'Continuar'
        }).then(
            () => navigate('/organizaciones')
        );
    };

    const fileRef = React.useRef();
    const handleFileLoaded = (event) => {
        const file = event.target.files?.[0];
        getBase64(file, (fileB64) => {
            console.log('=>(index.jsx:169) fileB64', fileB64);
        });
    };

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="bg-light flex-fill p-5">
                <div className="form-header">
                    <h2>Crear nuevo documento</h2>
                </div>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className="row form-row mt-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="fileInput" className="form-label">Adjuntar
                                Archivo</label>
                            <input type="file"
                                   ref={fileRef}
                                   className="form-control"
                                   id="fileInput"
                                   hidden={true}
                                   onChange={handleFileLoaded}/>
                            <FlatButton btnStyle={'primary'}
                                        label={'Adjuntar archivo'}
                                        size={'sm'}
                                        onclick={() => {
                                            fileRef.current.click();
                                        }}
                                        className={'w-100 form-control'}

                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="phoneNumberInput" className="form-label">Número de Teléfono</label>
                            <input type="phone" className="form-control" id="phoneNumberInput"/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="email1Input" className="form-label">Correo Electrónico 1</label>
                            <input type="email" className="form-control" id="email1Input"/>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-5 gap-5">
                        <FlatButton
                            label="ATRÁS"
                            btnStyle="info"
                            onclick={() => navigate(-1)}
                        />
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

export default NewExpirationFilePage;