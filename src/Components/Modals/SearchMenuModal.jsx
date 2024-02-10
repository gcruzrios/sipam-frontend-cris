import React from 'react';
import {SearchMenuList} from '../SearchMenu/SearchMenuList';
import {IfElse, When} from '@/utils/util';
import PropTypes from 'prop-types';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/material/DialogTitle';
import {ModalDialog} from '@mui/joy';
import DialogContent from '@mui/material/DialogContent';
import {Backdrop} from '@mui/material';
import useWindowDimensions from '../../App/hooks/useWindowDimensions';

export const SearchMenuModal = ({items, navigate, open, setOpen}) => {
    const {height, width} = useWindowDimensions();

    const modalDialogStyle = (theme) => ({
        backgroundColor: 'var(--bs-primary)',
        color: 'var(--bs-light)',
        maxWidth: `${width - 40}px`,
        maxHeight: `${height - 80}px`,
        top: 0,
        bottom: 'unset',
        marginTop: '65px',
        [theme.breakpoints.up('md')]: {
            marginLeft: 'unset',
            left: '300px',
            right: 'unset',
        },
        [theme.breakpoints.down('md')]: {
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    });

    return (
        <Backdrop open={open} onClick={() => setOpen(false)} sx={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{display: 'flex', justifyContent: 'start', alignItems: 'start'}}
                hideBackdrop
                disableAutoFocus
            >
                <ModalDialog
                    sx={modalDialogStyle}
                    layout={'left'}>
                    <ModalClose color="neutral"/>
                    <DialogTitle>Resultados</DialogTitle>
                    <DialogContent sx={{padding: 0}}>
                        <When condition={items.length !== 0}>
                            <div className="text-light">
                                <SearchMenuList
                                    items={items}
                                    navigate={navigate}
                                />
                            </div>
                        </When>
                    </DialogContent>
                    <div className="modal-footer">
                        <IfElse condition={items.length !== 0} then={
                            <>{items.length} resultados encontrados</>
                        }>
                            <>No se han encontrado resultados.</>
                        </IfElse>
                    </div>
                </ModalDialog>
            </Modal>
        </Backdrop>
    );
};

SearchMenuModal.propTypes = {
    items: PropTypes.array,
    navigate: PropTypes.func,
    open: PropTypes.bool,
    setOpen: PropTypes.func
};