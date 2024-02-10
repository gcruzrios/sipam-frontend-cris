import React from 'react';
import PropTypes from 'prop-types';
import redBackground from '../../assets/images/redUploadFileBackground.png';
import greenBackground from '../../assets/images/greenUploadFileBackground.png';
import { FlatButton } from '../Buttons/FlatButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

export const FileUploadCard = ({fileName, daysLeft, handler}) => {
    const iconUpload = <FontAwesomeIcon icon={faCloudArrowUp} />;
    return (
        <div className="card-file-upload d-flex flex-column">
            <div className="card-file-upload-img position-relative">
                <img src={daysLeft > 7 ? greenBackground : redBackground} className="w-100" alt=""/>
                <div className="d-flex flex-column position-absolute top-0 w-100 h-100">
                    <h5 className="m-2 text-center">{fileName}</h5>
                    <div className="align-self-center my-auto">
                        <h5 className="m-2 text-center text-light fw-bold">{daysLeft} {daysLeft > 1 ? 'dias' : 'día'}</h5>
                    </div>
                    <div className="m-3"> </div>
                </div>
            </div>
            <FlatButton
                label="Subir archivo"
                size="sm"
                btnStyle="secondary"
                icon={iconUpload}
                iconPosition="end"
                onclick={handler}
                />
        </div>
    );
};

FileUploadCard.propTypes = {
    fileName: PropTypes.string,
    daysLeft: PropTypes.number,
    handler: PropTypes.func
};
