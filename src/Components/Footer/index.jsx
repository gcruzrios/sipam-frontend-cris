import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({children}) => {
    return(
        <footer className="text-center text-lg-start text-muted">
            <div className="text-center p-3">
                {children}
            </div>
        </footer>
    );
};

Footer.propTypes = {
    children: PropTypes.any
};

Footer.defaultProps = {
    children: '© COPYRIGHT - CONAPAM 2023'
};

export default Footer;