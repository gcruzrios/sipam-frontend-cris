import {FlatButton} from '../Buttons/FlatButton';
import React from 'react';
import Swal from 'sweetalert2';
import {changePamStatus} from '@/Pages/InitialPage/actions';
import {deleteOrg} from '@/store/root/actions';
import {IfElse} from '@/utils/util';


export const pamTableColumns = [
    {
        header: 'Cédula',
        accessorKey: 'identificacion',
        enableHiding: false,
    },
    {
        header: 'Nombre',
        accessorKey: 'nombreCompleto',
        enableHiding: false,
    },
    {
        header: 'Modalidad',
        accessorKey: 'modalidad',
    },
    {
        header: 'Estado',
        accessorKey: 'estado',
    },
];

export const organizationsTableColumns = [
    {
        header: 'Nombre',
        accessorKey: 'name',
    },
    {
        header: 'Estado',
        accessorKey: 'status',
    },
    {
        header: 'Código',
        accessorKey: 'codigo',
    },
];

export const mapPamTableRows = row => ({
    identificacion: row.identificacion,
    idPersona: row.idPAM,
    estado: row.estado === 'A' ? 'Activo' : 'Inactivo',
    nombreCompleto: `${row.nombre} ${row.primerApellido} ${row.segundoApellido}`,
    modalidad: row.modalidad
});

export const mapOrganizationsTableRows = row => ({
    name: row.nombreOBS,
    status: row.estado === 'A' ? 'Activo' : 'Inactivo',
    codigo: row.codigoInstitucion,
    idOrg: row.idOBS
});

const eliminarPam = (dispatch, id) => {
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Seguro que desea elimnar el registro de Persona PAM?',
        confirmButtonText: 'Eliminar',
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: 'green'
    }).then(
        result => {
            if (result.isConfirmed) {
                dispatch(changePamStatus(id, 'I'));
            }
        }
    );
};

const activarPam = (dispatch, id) => {
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Seguro que desea reactivar el registro de Persona PAM?',
        confirmButtonText: 'Activar',
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: 'green'
    }).then(
        result => {
            if (result.isConfirmed) {
                dispatch(changePamStatus(id, 'A'));
            }
        }
    );
};

export const getActionsPam = (navigate, dispatch) => ({identificacion, idPersona, estado}) =>
    <div className="text-nowrap  ">
        <IfElse condition={estado === 'Activo'} then={
            <>
                <FlatButton
                    btnStyle={'danger'}
                    label={'Desactivar'}
                    size={'xs'}
                    outline
                    className={'m-1'}
                    onclick={() => eliminarPam(dispatch, idPersona)}
                />
                <FlatButton
                    btnStyle={'secondary'}
                    label={'Editar'}
                    size={'xs'}
                    outline
                    className={'m-1'}
                    onclick={() => navigate(`pam/editar/${identificacion}`)}
                />
                <FlatButton
                    btnStyle={'info'}
                    label={'Ver Más'}
                    size={'xs'}
                    outline
                    className={'m-1'}
                    onclick={() => navigate(`pam/ver/${identificacion}`)}
                />
            </>
        }>
            <FlatButton
                btnStyle={'danger'}
                label={'Activar'}
                size={'xs'}
                outline
                className={'m-1'}
                onclick={() => activarPam(dispatch, idPersona)}
            />
        </IfElse>
    </div>;

const eliminarOrg = (dispatch, id) => {
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Seguro que desea elimnar la organización?',
        confirmButtonText: 'Eliminar',
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: 'green'
    }).then(
        result => {
            if (result.isConfirmed) {
                dispatch(deleteOrg(id));
            }
        }
    );
};
export const getActionsOrgs = (navigate, dispatch) => ({idOrg}) =>
    <div className="text-nowrap  ">
        <FlatButton
            btnStyle={'danger'}
            label={'Eliminar'}
            size={'xs'}
            outline
            className={'m-1'}
            onclick={() => eliminarOrg(dispatch, idOrg)}
        />
        <FlatButton
            btnStyle={'secondary'}
            label={'Editar'}
            size={'xs'}
            outline
            className={'m-1'}
            onclick={() => navigate(`organizaciones/editar/${idOrg}`)}
        />
        <FlatButton
            btnStyle={'info'}
            label={'Ver Más'}
            size={'xs'}
            outline
            className={'m-1'}
            onclick={() => navigate(`organizaciones/ver/${idOrg}`)}
        />
    </div>;