import React from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import SimpleTable from '../../Components/Tables/SimpleTable';
import {useDispatch, useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import {deleteUser} from './actions';

const iconPlus = <FontAwesomeIcon icon={faPlus}/>;

const UsersPage = () => {
    const navigate = useNavigate();
    const users = useSelector(state => state.usersPage?.usersList) || [];
    const dispatch = useDispatch();

    const eliminarUsuario = (id) => {
        Swal.fire({
            icon: 'question',
            title: 'Confirmación',
            text: '¿Seguro que desea elimnar el usuario?',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: 'red',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'green'
        }).then(
            result => {
                if (result.isConfirmed) {
                    dispatch(deleteUser(id));
                }
            }
        );
    };

    const getActions = ({id}) => <div className="d-flex flex-nowrap text-nowrap">
        <FlatButton btnStyle={'danger'} label={'Eliminar'} size={'xs'} outline className={'m-1'}
                    onclick={() => eliminarUsuario(id)}/>
        <FlatButton btnStyle={'secondary'} label={'Editar'} size={'xs'} outline className={'m-1'}
                    onclick={() => navigate(`editar/${id}`)}/>
        <FlatButton btnStyle={'info'} label={'Ver Más'} size={'xs'} outline className={'m-1'}
                    onclick={() => navigate(`ver/${id}`)}/>
    </div>;

    const tableRows = users?.map(
        row => ({
            name: `${row.nombre} ${row.primerApellido}`,
            user: row.usuario,
            email: row.correo,
            site: row.organizacion,
            id: row.idUsuario,
        })
    );

    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'name',
        },
        {
            header: 'Usuario',
            accessorKey: 'user',
        },
        {
            header: 'Correo',
            accessorKey: 'email',
        },
        {
            header: 'Sede',
            accessorKey: 'site',
        },

    ];


    return (
        <CommonLayout>
            <div className="bg-light flex-fill">
                <div className="d-flex flex-column p-5">
                    <div className="d-flex justify-content-between">
                        <h2>Usuarios</h2>
                        <FlatButton
                            label="NUEVO"
                            btnStyle="primary"
                            size="xs"
                            icon={iconPlus}
                            iconPosition="end"
                            onclick={() => navigate('/usuarios/registrar')}
                        />
                    </div>
                </div>
                <div className="container-lg">
                    <SimpleTable columns={columns} data={tableRows} getActions={getActions}/>
                </div>
            </div>
        </CommonLayout>
    );
};

export default UsersPage;