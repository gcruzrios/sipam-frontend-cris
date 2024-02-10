import React from 'react';
import PropTypes from 'prop-types';
import logoConapam from '../../assets/images/logoConapam.svg';
import './styles.scss';

export const LoginCard = ({children, size, ...props}) => {

    const modes = {
        medium: [
            'container-md'
        ],
        large: [
            'container-lg'
        ]
    };

    return (
        <div className={['login-container', 'p-0', ...modes[size]].join(' ')} {...props}>
            <div className={['login-card-header p-3', size].join(' ')}>
                <img src={logoConapam} alt="logo conapam" />
            </div>
            {children}
        </div>
    );
};

LoginCard.propTypes = {
    children: PropTypes.node,
    size: PropTypes.oneOf(['medium', 'large'])
};