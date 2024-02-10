import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {getBase64} from '@/utils/util';
import {FlatButton} from '../Buttons/FlatButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OptionsSelector from '../Fields/OptionsSelector';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useState} from 'react';
import moment from 'moment';

export const NewDocumentModal = ({fileTypes, sendFileCallback}) => {
    const [open, setOpen] = React.useState(false);
    const iconPlus = <FontAwesomeIcon icon={faPlus}/>;
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    const BootstrapDialog = styled(Dialog)(({theme}) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const [fileName, setFileName] = React.useState('');
    const [base64File, setBase64File] = React.useState();

    const fileRef = React.useRef();
    const handleFileLoaded = (event) => {
        const file = event.target.files?.[0];
        getBase64(file, (fileB64) => {
            setBase64File(fileB64);
            setFileName(event.target.files?.[0].name);
        });
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const [fileType, setFileType] = React.useState();

    const handleFileTypeSelected = (event) => {
        setFileType(event.target.value);
    };

    const [expirationDate, setExpirationDate] = useState('');

    const handleExpirationDateSelected = (event) => {
        const value = event.target?.value;
        setExpirationDate(value);
    }

    const handleSend = () => {
        sendFileCallback && sendFileCallback({
            fileName,
            fileType,
            base64File,
            expirationDate: moment(expirationDate).format("DD/MM/YYYY")
        });
        handleClose();
    };

    return (
        <React.Fragment>
            <FlatButton
                className="mt-auto"
                label="NUEVO"
                btnStyle="primary"
                icon={iconPlus}
                iconPosition="end"
                onclick={handleClickOpen}
            />
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                    Cargar nuevo archivo
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent dividers>
                    <div className="row form-row mt-4">
                        <div className="col-auto col-12 d-flex">
                            <div className="mt-auto">
                                <Button component="label" variant="contained" startIcon={<CloudUploadIcon/>}>
                                    Cargar archivo
                                    <VisuallyHiddenInput type="file" onChange={handleFileLoaded} ref={fileRef}/>
                                </Button>
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            {fileName && <p className="text-primary"><InsertDriveFileIcon/> {fileName}</p>}
                        </div>
                        <div className="col-auto col-12">
                            <label htmlFor="filePickerInput" className="form-label">Tipo de Archivo</label>
                            <OptionsSelector
                                className="form-select"
                                id="filePickerInput"
                                options={fileTypes}
                                placeholder={'Seleccione un tipo de archivo'}
                                onChange={handleFileTypeSelected}
                                value={fileType}
                            />
                        </div>
                        <div className="col-auto col-12">
                            <label htmlFor="fileExpirationDate" className="form-label">Fecha de Expiración</label>
                            <input
                                id="fileExpirationDate"
                                className={'form-control'}
                                type={'date'}
                                onChange={handleExpirationDateSelected}
                                value={expirationDate}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions
                    sx={
                        {
                            display: 'flex',
                            justifyContent: 'center'
                        }
                    }>
                    <Button
                        variant="outlined"
                        onClick={handleSend}
                        disabled={!fileName || !fileType || !expirationDate}
                    >
                        Enviar documento
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
};