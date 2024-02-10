import React, {useCallback} from 'react';
import {FlatButton} from '../Buttons/FlatButton';
import {useDispatch, useSelector} from 'react-redux';
import {getDaysLeft, getEstadoDocById, getTipoDocumentoById, getTiposDocumento, When} from '@/utils/util';
import {equals, isEmpty} from 'ramda';
import CompactTable from '../Tables/CompactTable';
import {IconButton, Tooltip} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {useNavigate} from 'react-router-dom';
import {getUserRole} from '@/App/hooks/useAuth';
import {ROLE_ADMIN, ROLE_ORG} from '@/store/model';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import {aceptarDocumento, rechazarDocumento} from '@/store/root/actions';

export const ReviewingFilesCard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const listaDocumentos = useSelector(state => state.root.listaDocumentos);
    const tiposDocumento = getTiposDocumento(useSelector);

    const documentos = React.useMemo(() => {
        if (listaDocumentos && tiposDocumento && !isEmpty(tiposDocumento)) {
            return listaDocumentos?.map(
                row => ({
                    ...row,
                    tipoDocumento: getTipoDocumentoById(row.tipoDocumento, tiposDocumento),
                    diasFaltantes: getDaysLeft(row.fechaCarga, parseInt(row.diasVigencia)),
                    estado: getEstadoDocById(row.estado),
                    idEstado: row.estado
                })
            );
        }
    }, [listaDocumentos, tiposDocumento]);

    const columns = [
        {
            header: 'OBS/GL',
            accessorKey: 'nombreOBS',
            enableHiding: false,
        },
        {
            header: 'Documento',
            accessorKey: 'tipoDocumento',
        }
    ];

    const handleAceptarDocumento = (idDocumento) => {
        Swal.fire({
            icon: 'question',
            title: 'Confirmación',
            text: '¿Seguro que desea acpetar el documento?',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'green',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'blue'
        }).then(
            result => {
                if (result.isConfirmed) {
                    dispatch(aceptarDocumento(idDocumento));
                }
            }
        );
    };

    const handleRechazarDocumento = (idDocumento) => {
        Swal.fire({
            icon: 'question',
            title: 'Confirmación',
            text: '¿Seguro que desea rechazar el documento?',
            confirmButtonText: 'Rechazar',
            confirmButtonColor: 'red',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'blue'
        }).then(
            result => {
                if (result.isConfirmed) {
                    dispatch(rechazarDocumento(idDocumento));
                }
            }
        );
    };

    const getActions = useCallback((row) => {
        const docUrl = row?.rutaFisica;
        const idDocumento = row?.idDocumento;
        const estado = row?.idEstado;
        return (<div className="text-nowrap ">
            <When condition={equals(getUserRole(), ROLE_ADMIN)}>
                <Tooltip title="Descargar" arrow>
                    <IconButton
                        size={'small'}
                        aria-label="descargar"
                        className="text-secondary"
                        onClick={() => window.open(docUrl, '_blank')}>
                        <CloudDownloadIcon/>
                    </IconButton>
                </Tooltip>
                <When condition={equals(estado, '1')}>
                    <Tooltip title="Aceptar" arrow>
                        <IconButton
                            size={'small'}
                            aria-label="check"
                            className="text-success"
                            onClick={() => handleAceptarDocumento(idDocumento)}>
                            <CheckCircleIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Rechazar" arrow>
                        <IconButton
                            size={'small'}
                            aria-label="delete"
                            className="text-danger"
                            onClick={() => handleRechazarDocumento(idDocumento)}>
                            <WarningIcon/>
                        </IconButton>
                    </Tooltip>
                </When>
            </When>
            <When condition={equals(getUserRole(), ROLE_ORG)}>
                <Tooltip title="Descargar" arrow>
                    <IconButton
                        size={'small'}
                        aria-label="descargar"
                        className="text-secondary"
                        onClick={() => window.open(docUrl, '_blank')}>
                        <VisibilityIcon/>
                    </IconButton>
                </Tooltip>
            </When>
        </div>);
    }, []);

    return (
        <div className="card card-file-upload-list flex-fill text-center">
            <div className="card-header fw-bold text-danger">
                DOCUMENTOS PARA REVISION
            </div>

            <div className={'card-body p-0 d-flex flex-fill'}>
                <When condition={documentos && documentos.length > 0}>
                    <CompactTable
                        getActions={getActions}
                        columns={columns}
                        data={documentos}/>
                </When>
            </div>

            <div className="card-footer mt-auto">
                <FlatButton
                    btnStyle={'primary'}
                    label={'Ver más'}
                    size={'sm'}
                    outline
                    onclick={() => navigate('/vencimientos')}
                />
            </div>
        </div>
    );
};