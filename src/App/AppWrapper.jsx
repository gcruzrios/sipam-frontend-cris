import React from 'react';
import DashboardLayout from '../Containers/DashboardLayout';
import FooterLayout from '../Containers/FooterLayout';
import PropTypes from 'prop-types';

const AppWrapper = (
    {
        Header,
        SideNav,
        Footer,
        Component,
        layout
    }
) => {

    if (layout === 'Dashboard') {
        return (
            <DashboardLayout
                Header={Header}
                SideNav={SideNav}
                Footer={Footer} >
                <Component />
            </DashboardLayout>
        );
    } if (layout === 'Footer') {
        return (
            <FooterLayout Footer={Footer}>
                <Component />
            </FooterLayout>
        );
    }

    return Component;
};

AppWrapper.propTypes = {
    Component: PropTypes.func,
    Header: PropTypes.node,
    SideNav: PropTypes.node,
    Footer: PropTypes.node,
    layout: PropTypes.string
};

export default AppWrapper;