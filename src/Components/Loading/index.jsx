import React from 'react';
import './styles.scss';

const Loading = () => {
    const style = {top: 'calc(50vh - 40px)'};
    return (<div className="loading-component d-flex justify-content-center">
        <div className="d-flex flex-column flex-fill justify-content-center align-items-center position-fixed"
             style={style}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <br/>
            <h2 className="text-primary">Cargando...</h2>
        </div>
    </div>);
};
    

export default Loading;