import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export const FlatButton = ({ label, size, btnStyle, outline, icon, iconPosition, onclick, className = '', type = 'button'}) => {
    const btnStyles = `btn${outline ? '-outline' : ''}-${btnStyle}`;
    const btnSize = `btn-${size}`;
    const labelMarginClass = icon ? (iconPosition === 'start' ? 'ms-3 me-4' : 'ms-4 me-3') : 'mx-3';
    return (
        <button type={type} className={`btn btn-flat ${btnSize} ${btnStyles} `.concat(className)} onClick={onclick}>
            <span>{icon && iconPosition === 'start' && ( icon )}</span>
            <span className={labelMarginClass}>{label}</span>
            <span>{icon && iconPosition === 'end' && ( icon )}</span>
        </button>
    );
};

FlatButton.propTypes = {
    label: PropTypes.string.isRequired,
    size: PropTypes.oneOf([
        'xs',
        'sm',
        'lx'
    ]),
    btnStyle: PropTypes.oneOf([
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark'
    ]).isRequired,
    outline: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf([
        'start',
        'end'
    ]),
    onclick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string
};

