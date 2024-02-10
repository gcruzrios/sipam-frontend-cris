import React, {useEffect, useState} from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {useNavigate} from 'react-router-dom';
import bg from '../../assets/images/indexBackground.png';
import {getDaysLeft, getEstadoDocById, getTipoDocumentoById, getTiposDocumento, When} from '@/utils/util';
import ExpirationsPageTable from '../../Components/Tables/ExpirationsPageTable';
import {DateRangePicker} from 'mui-daterange-picker';
import {equals, isEmpty, map, replace} from 'ramda';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import {es} from 'date-fns/locale';
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfMonth,
    startOfWeek,
    startOfYear
} from 'date-fns';
import styled from '@emotion/styled';
import {IconButton} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {getUserRole} from '@/App/hooks/useAuth';
import {ROLE_ADMIN, ROLE_ORG} from '@/store/model';
import {NewDocumentModal} from '@/Components/Modals/NewDocumentModal';
import {aceptarDocumento, rechazarDocumento, sendNewFile} from '@/store/root/actions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {downloadZip} from '@/utils/zipFileDownloader';
import Swal from 'sweetalert2';
import {deleteLaw} from '../LawsPage/actions';


const ExpirationsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [dateRange, setDateRange] = React.useState({});
    const listaDocumentos = useSelector(state => state.root.listaDocumentos);
    const tiposDocumento = getTiposDocumento(useSelector);
    const selectedStatus = useSelector(state => state.expirationsPage?.selectedStatus);

    const documentos = React.useMemo(() => {
        if (listaDocumentos  && tiposDocumento && !isEmpty(tiposDocumento)) {
            return listaDocumentos?.
            filter(d => equals(d.estado, selectedStatus) && (isEmpty(dateRange) || (dateRange && moment(d.fechaCarga).isBetween(moment(dateRange.startDate), moment(dateRange.endDate))))).
            map(
                row => ({
                    ...row,
                    tipoDocumento: getTipoDocumentoById(row.tipoDocumento, tiposDocumento),
                    diasFaltantes: getDaysLeft(row.fechaCarga, parseInt(row.diasVigencia)),
                    estado: getEstadoDocById(row.estado),
                    idEstado: row.estado,
                    fecha: moment(row.fechaCarga)
                })
            );
        }
    }, [listaDocumentos, tiposDocumento, selectedStatus]);

    React.useEffect(() => {
        console.log("=>(index.jsx:66) documentos", documentos);
    }, [documentos]);

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
    }

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
    }

    const getActionsForAdmin = (row) => {
        const docUrl = row.original?.rutaFisica;
        const idDocumento = row.original?.idDocumento;
        const estado = row.original?.idEstado;
        return (<div className="text-nowrap ">
            <IconButton
                aria-label="descargar"
                className="text-secondary"
                onClick={() => window.open(docUrl, '_blank')}>
                <CloudDownloadIcon/>
            </IconButton>
            <When condition={estado === "1"}>
                <IconButton aria-label="check"
                            className="text-success"
                            onClick={() => handleAceptarDocumento(idDocumento)}>
                    <CheckCircleIcon/>
                </IconButton>
                <IconButton aria-label="delete"
                            className="text-danger"
                            onClick={() => handleRechazarDocumento(idDocumento)}>
                    <WarningIcon/>
                </IconButton>
            </When>
        </div>);
    };

    const getActionsForOrg = (row) => {
        const docUrl = row.original?.rutaFisica;
        return (<div className="text-nowrap ">
            <IconButton
                aria-label="descargar"
                className="text-secondary"
                onClick={() => window.open(docUrl, '_blank')}>
                <VisibilityIcon/>
            </IconButton>
        </div>);
    };


    const columnsForAdminView = [
        {
            header: 'Código',
            accessorKey: 'codigosOBS',
            enableHiding: false,
        },
        {
            header: 'Nombre OBS/GL',
            accessorKey: 'nombreOBS',
            enableHiding: false,
        },
        {
            header: 'Documento',
            accessorKey: 'tipoDocumento',
        },
        {
            header: 'Dias Faltantes',
            accessorKey: 'diasFaltantes',
        },
    ];

    const columnsForOrgView = [
        {
            header: 'Estado',
            accessorKey: 'estado',
            enableHiding: false,
        },
        {
            header: 'Documento',
            accessorKey: 'tipoDocumento',
        },
        {
            header: 'Dias Faltantes',
            accessorKey: 'diasFaltantes',
        },
    ];

    const toggle = () => setOpen(!open);

    const formatDate = (date) => moment(date).locale('es').format('DD-MMM-YYYY');

    const getDates = (range) => {
        if (!isEmpty(range)) {
            return formatDate(range.startDate) + (range.endDate ? ' - ' + formatDate(range.endDate) : '');
        }
        return '';
    };

    const getCustomRanges = (date, locale) => [
        {
            label: 'Hoy',
            startDate: date,
            endDate: date,
        },
        {
            label: 'Ayer',
            startDate: addDays(date, -1),
            endDate: addDays(date, -1),
        },
        {
            label: 'Esta Semana',
            startDate: startOfWeek(date, {locale}),
            endDate: endOfWeek(date, {locale}),
        },
        {
            label: 'Semana Pasado',
            startDate: startOfWeek(addWeeks(date, -1), {locale}),
            endDate: endOfWeek(addWeeks(date, -1), {locale}),
        },
        {
            label: 'Este Mes',
            startDate: startOfMonth(date),
            endDate: endOfMonth(date),
        },
        {
            label: 'Mes Pasada',
            startDate: startOfMonth(addMonths(date, -1)),
            endDate: endOfMonth(addMonths(date, -1)),
        },
        {
            label: 'Este Año',
            startDate: startOfYear(date),
            endDate: endOfYear(date),
        },
        {
            label: 'Año Pasado',
            startDate: startOfYear(addYears(date, -1)),
            endDate: endOfYear(addYears(date, -1)),
        },
    ];

    const StyledTextInput = styled((props) => (
        <TextField {...props} />
    ))(({theme}) => ({
        '& .MuiInputBase-input': {
            minWidth: '220px',
        }
    }));

    const parseRutaFisica = (rutaFisica) => replace('https://api.conapam.go.cr/docsSIPAM', '', rutaFisica)

    const handleSaveAll = () => {
        const urls = map((d) => ({
            url: parseRutaFisica(d.rutaFisica),
            name: `${d.idDocumento}_${d.nombreDocumento}`
        }), documentos);
        downloadZip(urls).then(() => {
            console.log("=>(index.jsx:195) descargado");
        })
    }

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="container-fluid d-flex flex-fill flex-column bg-semi-50 p-0 m-0">
                <div className="d-flex flex-column p-5">
                    <div className="d-flex justify-content-between">
                        <h2>Control de Vencimientos</h2>
                    </div>
                    <div className="d-flex justify-content-between flex-row mt-3">
                        <div className="d-flex flex-column">
                            <StyledTextInput
                                className="form-control"
                                id="outlined-basic"
                                label="Fecha"
                                variant="filled"
                                value={getDates(dateRange)}
                                onClick={toggle}
                                InputProps={{
                                    disableUnderline: true, // <== added this
                                }}
                                style={{
                                    minWidth: 200,
                                }}/>
                            <DateRangePicker
                                wrapperClassName={'date-range-wrapper'}
                                definedRanges={getCustomRanges(new Date(), es)}
                                locale={es}
                                open={open}
                                toggle={toggle}
                                onChange={(range) => {
                                    setDateRange(range);
                                    toggle();
                                    console.log("=>(index.jsx:284) range", range);
                                    const end = moment(range.endDate);
                                    console.log("=>(index.jsx:290) end", end);
                                }}
                            />
                        </div>
                        <div className="d-flex">
                            <When condition={equals(getUserRole(), ROLE_ADMIN)}>
                                <FlatButton
                                    className="mt-auto"
                                    label="VER TODO"
                                    btnStyle="primary"
                                    onclick={() => navigate('/vencimientos/lista')}
                                />
                            </When>

                            <When condition={equals(getUserRole(), ROLE_ORG)}>
                                <NewDocumentModal
                                    fileTypes={tiposDocumento}
                                    sendFileCallback={(fileData) => dispatch(sendNewFile(fileData))}/>
                                <FlatButton
                                    className="mt-auto ms-3"
                                    label="GUARDAR TODO"
                                    btnStyle="primary"
                                    onclick={handleSaveAll}
                                />
                            </When>
                        </div>
                    </div>
                </div>
                <When condition={!!documentos && equals(getUserRole(), ROLE_ADMIN)}>
                    <div className="container-lg">
                        <ExpirationsPageTable
                            columns={columnsForAdminView}
                            data={documentos}
                            getActions={getActionsForAdmin}
                        />
                    </div>
                </When>
                <When condition={!!documentos && equals(getUserRole(), ROLE_ORG)}>
                    <div className="container-lg">
                        <ExpirationsPageTable
                            columns={columnsForOrgView}
                            data={documentos}
                            getActions={getActionsForOrg}
                        />
                    </div>
                </When>
            </div>
        </CommonLayout>
    );
};

export default ExpirationsPage;