import React from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import bg from '../../assets/images/indexBackground.png';
import { FlatButton } from '@/Components/Buttons/FlatButton';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () =>{
    const navigate = useNavigate();

    const handleReturnClick = () => {
        navigate('/');
    };

    return(
        <CommonLayout style={{ backgroundImage: `url(${bg})` }}>
            <div id="backdrop-page" className="d-flex flex-grow-1 bg-semi-50">
                <div className="d-flex flex-fill flex-column justify-content-center align-items-center text-secondary">
                    <h1>Página no encontrada</h1>
                    <br/>
                    <FlatButton
                        label="Regresar al inicio"
                        btnStyle="primary"
                        outline
                        onclick={handleReturnClick}
                    />
                </div>
            </div>
        </CommonLayout>);
    };

export default NotFoundPage;
