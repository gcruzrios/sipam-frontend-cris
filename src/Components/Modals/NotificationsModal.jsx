import React from 'react';
import {When} from '@/utils/util';
import PropTypes from 'prop-types';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import {ModalDialog} from '@mui/joy';
import DialogContent from '@mui/material/DialogContent';
import {Backdrop, Typography} from '@mui/material';
import useWindowDimensions from '../../App/hooks/useWindowDimensions';
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined';


export const NotificationItemsList = ({items}) => {
    return (
        <div className="list-group">
            {
                items.map(
                    (item, index) => <NotificationItem {...item} key={index}/>
                )
            }
        </div>);
};

export const NotificationItem = (
    {
        title,
        subtitle,
        type
    }
) => {
    return (
        <div className="search-item list-group-item list-group-item-info list-group-item-action fade show">
            <div className="w-100 d-flex flex-row flex-fill py-0 px-2">
                <div className="d-flex flex-column align-items-start me-2">
                    <Typography variant="body2" gutterBottom>
                        {title}
                    </Typography>
                    {subtitle &&
                        <Typography variant="caption" gutterBottom>
                            {subtitle}
                        </Typography>
                    }
                </div>
                <div className="ms-auto">
                    <PlagiarismOutlinedIcon fontSize="small"/>
                </div>
            </div>
        </div>
    );
};

NotificationItem.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string
};

export const NotificationsModal = ({items, open, setOpen}) => {
    const {height, width} = useWindowDimensions();

    const modalDialogStyle = (theme) => ({
        backgroundColor: 'var(--bs-primary)',
        color: 'var(--bs-light)',
        maxWidth: `${width - 40}px`,
        maxHeight: `${height - 80}px`,
        top: 0,
        bottom: 'unset',
        marginTop: '65px',
        padding: '10px',
        [theme.breakpoints.up('md')]: {
            marginLeft: 'unset',
            right: '30px',
            left: 'unset',
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
                    layout={'right'}>
                    <ModalClose color="neutral"/>
                    <DialogContent sx={{padding: 0}}>
                        <When condition={items.length !== 0}>
                            <div className="text-light pt-4">
                                <NotificationItemsList
                                    items={items}
                                />
                            </div>
                        </When>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </Backdrop>
    );
};

NotificationsModal.propTypes = {
    items: PropTypes.array,
    navigate: PropTypes.func,
    open: PropTypes.bool,
    setOpen: PropTypes.func
};