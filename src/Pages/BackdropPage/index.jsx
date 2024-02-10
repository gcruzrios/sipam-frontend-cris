import React from 'react';
import './styles.scss';

const BackdropPage = () =>
    <div id="backdrop-page" className="backdrop-container">
        <div className="d-flex flex-fill justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    </div>;

export default BackdropPage;