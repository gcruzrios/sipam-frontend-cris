import React from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import SimpleTable from '../../Components/Tables/SimpleTable';
import {useDispatch, useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import {deleteLaw} from './actions';
import {getUserRole} from '@/App/hooks/useAuth';
import {When} from '@/utils/util';
import {equals} from 'ramda';
import {ROLE_ADMIN, ROLE_ORG} from '@/store/model';

const iconPlus = <FontAwesomeIcon icon={faPlus}/>;

const LawsPage = () => {

    const leyes = useSelector(state => state?.lawsPage?.lawsList || []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRole = getUserRole();

    const eliminarLey = (id) => {
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
                    dispatch(deleteLaw(id));
                }
            }
        );
    };


    const getActions = ({idLey}) => <div className="text-nowrap">
        <When condition={equals(userRole, ROLE_ADMIN)}>
            <FlatButton btnStyle={'danger'} label={'Eliminar'} size={'xs'} outline className={'m-1'}
                        onclick={() => eliminarLey(idLey)}/>
            <FlatButton btnStyle={'secondary'} label={'Editar'} size={'xs'} outline className={'m-1'}
                        onclick={() => navigate(`editar/${idLey}`)}/>
        </When>
        <FlatButton btnStyle={'info'} label={'Ver Más'} size={'xs'} outline className={'m-1'}
                    onclick={() => navigate(`ver/${idLey}`)}/>
    </div>;

    const tableRows = leyes?.map(
        row => ({
            name: row.nombreLey,
            lawNumber: row.numeroLey,
            porcentaje: `${row.porcentajeMonetario} %`,
            descripcion: row.descripcion,
            idLey: row.idLey
        })
    );

    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'name',
        },
        {
            header: 'Número de Ley',
            accessorKey: 'lawNumber',
        },
        {
            header: 'Porcentaje',
            accessorKey: 'porcentaje',
        },
        {
            header: 'Descripción',
            accessorKey: 'descripcion',
        },
    ];

    return (
        <CommonLayout>
            <div className="bg-light flex-fill">
                <div className="d-flex flex-column p-5">
                    <div className="d-flex justify-content-between">
                        <h2>Lista de Leyes</h2>
                        <When condition={equals(userRole, ROLE_ADMIN)}>
                            <FlatButton
                                label="NUEVO"
                                btnStyle="primary"
                                size="xs"
                                icon={iconPlus}
                                iconPosition="end"
                                onclick={() => navigate('/leyes/registrar')}
                            />
                        </When>
                    </div>
                </div>
                <div className="container-lg">
                    <SimpleTable
                        columns={columns}
                        data={tableRows}
                        getActions={getActions}
                    />
                </div>
            </div>


        </CommonLayout>
    );
};

export default LawsPage;