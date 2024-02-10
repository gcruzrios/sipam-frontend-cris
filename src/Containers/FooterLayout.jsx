import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';

const FooterLayout = ({children, Footer}) => {
    return (
        <div className="layout-with-footer">
            {children}
            {Footer}
        </div>
    );
};

FooterLayout.propTypes = {
    children: PropTypes.node,
    Footer: PropTypes.node
};

export default FooterLayout;

