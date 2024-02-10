import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import {FlatButton} from './FlatButton';
import PropTypes from 'prop-types';

export const FormBackButton = ({navigate}) => {
    const iconBack = <FontAwesomeIcon icon={faAngleLeft}/>;
    return (
        <FlatButton
            label='ATRÁS'
            btnStyle='info'
            onclick={() => navigate(-1)}
            icon={iconBack}
            iconPosition='start'
        />
    );
};
FormBackButton.propTypes = {
    navigate: PropTypes.func
};

