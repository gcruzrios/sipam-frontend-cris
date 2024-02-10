import React from 'react';
import Logo from '../../assets/images/logoConapamSmall.svg';
import {FlatButton} from '../Buttons/FlatButton';
import {useLocation, useNavigate} from 'react-router-dom';
import btnIconBlack from '../../assets/icons/btnNavIconBlack.svg';
import btnIconWhite from '../../assets/icons/btnNavIconWhite.svg';
import './styles.scss';
import useAuth from '../../App/hooks/useAuth';
import {includes} from 'ramda';


export const SideNav = ({navItems}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {role} = useAuth();

    const currentPath = '/' + location.pathname.split('/')?.[1];

    const defaultIcon = (icon) => <img src={icon} alt="icon" className="btn-nav-icon"></img>;

    const btnGroup =
        navItems
            .filter(({roles}) => includes(role, roles))
            .map(({label, path}, index) => (
                <FlatButton
                    key={index}
                    label={label}
                    btnStyle={path === currentPath ? 'info' : 'secondary'}
                    size="sm"
                    outline={path !== currentPath}
                    onclick={path === currentPath ? null : () => {
                        navigate(path);
                    }}
                    className={`text-start p-2 btn-side-nav ${path === currentPath ? 'active text-dark' : 'inactive text-light'}`}
                    icon={defaultIcon(path !== currentPath ? btnIconWhite : btnIconBlack)}
                    iconPosition="start"
                />
            ));

    const SideBarContent =
        <>
            <img src={Logo} alt="logo" className="w-50 mx-auto my-2"/>
            <div className="btn-group-vertical side-nav mb-5" role="group" aria-label="Opciones de navegación">
                {btnGroup}
            </div>
        </>;

    return (
        <div className="sidebar-container container-fluid align-items-start bg-secondary w-100 h-100 p-0">

            <div className="offcanvas offcanvas-start bg-secondary" tabIndex="-1" id="navbarSidebarToggler"
                 aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-auto" data-bs-dismiss="offcanvas"
                            aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column p-0">
                    {SideBarContent}
                </div>
            </div>
        </div>
    );
};