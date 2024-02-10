import React from 'react';
import PropTypes from 'prop-types';

const TopLevel = ({ Routes, ApplicationProvider }) =>
    <ApplicationProvider>
        <Routes />
    </ApplicationProvider>;

TopLevel.propTypes = {
    Routes: PropTypes.func,
    ApplicationProvider: PropTypes.func
};

export default TopLevel;