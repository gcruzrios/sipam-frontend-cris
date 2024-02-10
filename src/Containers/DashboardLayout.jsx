import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';

const DashboardLayout = ({children, Header, SideNav, Footer}) => {
    return (
        <div className="dashboard-layout">
            <div className="d-flex">
                <div className="d-flex navbar navbar-expand-lg p-0">
                    {SideNav}
                </div>
                <div className="d-flex flex-column flex-fill">
                    {Header}
                    {children}
                    {Footer}
                </div>
            </div>
        </div>
    );
};

DashboardLayout.propTypes = {
    children: PropTypes.node,
    Header: PropTypes.node,
    Footer: PropTypes.node,
    SideNav: PropTypes.node,
    background: PropTypes.any
};

export default DashboardLayout;