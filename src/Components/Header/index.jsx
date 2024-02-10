import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import {SearchField} from '../Fields/SearchField';
import PropTypes from 'prop-types';
import './styles.scss';
import {getResultadoBusqueda} from '@/server/api';
import {asyncDebounce} from '@/utils/util';
import {isEmpty} from 'ramda';
import {Button, IconButton} from '@mui/material';
import {ExitToApp, Notifications, Person} from '@mui/icons-material';
import {NotificationsModal} from '@/Components/Modals/NotificationsModal';

export const Header = ({userName, notifications}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout', {state: {from: '/'}});
    };

    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const handleSearchChange = asyncDebounce((value) => {
        if (isEmpty(value)) {
            setSearchResults([]);
            return;
        }
        getResultadoBusqueda(value).then(
            result => {
                if (result.CodigoResultado === '00' && result.Resultado) {
                    const data = result.Resultado.map(
                        r => (
                            {
                                name: r.nombre,
                                identifier: r.cedula,
                                id: r.idRegistro,
                                recordType: r.tipoDato
                            }
                        )
                    );
                    setSearchResults(data);
                } else {
                    setSearchResults([]);
                }
            }
        );

    }, 750);

    const openNotificationModal = () => {
        setNotificationsOpen(true);
    };

    return (
        <nav className="navbar navbar-dark navbar-expand-lg bg-primary p-3">
            <div className="container-fluid">
                <button className="btn navbar-toggler collapsed " type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#navbarSidebarToggler" aria-controls="offcanvasNavbar"
                        aria-label="Toggle navigation">
                    Menú
                </button>
                <div className="navbar-brand">
                    <SearchField
                        style={'light'}
                        searchItems={searchResults}
                        navigate={navigate}
                        value={searchValue}
                        onChange={(event) => {
                            const value = event.target.value;
                            setSearchValue(value);
                            handleSearchChange(value);
                        }}
                    />
                </div>
                <button className="btn navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarHeaderToggler" aria-controls="navbarTogglerDemo01" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarHeaderToggler">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fs-6 column-gap-2 text-light">
                        <li className="nav-item">
                            <IconButton variant="text" aria-label="notificaciones"
                                        className="" size="medium" color="inherit" onClick={openNotificationModal}>
                                <Notifications fontSize="small"/>
                            </IconButton>
                            <NotificationsModal
                                items={notifications}
                                open={notificationsOpen}
                                setOpen={setNotificationsOpen}
                            />
                        </li>
                        <li className="nav-item">
                            <Button variant="text" startIcon={<Person/>} aria-label="usuario" className="" size="medium"
                                    color="inherit" sx={{textTransform: 'unset'}}>
                                {userName}
                            </Button>
                        </li>
                        <li className="nav-item">
                            <Button variant="outlined" endIcon={<ExitToApp fontSize="small"/>} aria-label="usuario"
                                    size="medium" color="inherit" onClick={handleLogout} sx={{textTransform: 'unset'}}>
                                Salir
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

Header.propTypes = {
    userName: PropTypes.string,
};

const mapStateToProps = state => {
    const userName = state.user?.nombre;
    const notifications = state.root?.notifications;

    return {
        userName,
        notifications
    };
};


export default connect(mapStateToProps, null)(Header);