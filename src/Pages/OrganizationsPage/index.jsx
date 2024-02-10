import React from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import SimpleTable from '../../Components/Tables/SimpleTable';
import Swal from 'sweetalert2';
import {mapOrganizationsTableRows, organizationsTableColumns} from '@/Components/Tables/model';
import {deleteOrg} from '@/store/root/actions';

const iconPlus = <FontAwesomeIcon icon={faPlus}/>;

const OrganizationsPage = () => {
    const organizaciones = useSelector(state => state?.root?.orgsList || []);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const eliminarOrganiacion = (id) => {
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

    const getActions = (row) => {
        const {idOrg} = row;
        return (<div className="d-flex flex-nowrap text-nowrap">
            <FlatButton btnStyle={'danger'} label={'Eliminar'} size={'xs'} outline className={'m-1'}
                        onclick={() => eliminarOrganiacion(idOrg)}/>
            <FlatButton btnStyle={'secondary'} label={'Editar'} size={'xs'} outline className={'m-1'}
                        onclick={() => navigate(`editar/${idOrg}`)}/>
            <FlatButton btnStyle={'info'} label={'Ver Más'} size={'xs'} outline className={'m-1'}
                        onclick={() => navigate(`ver/${idOrg}`)}/>
        </div>);
    };

    const tableRows = React.useMemo(() => organizaciones?.map(
        mapOrganizationsTableRows
    ), [organizaciones]);

    return (
        <CommonLayout>
            <div className="bg-light flex-fill">
                <div className="d-flex flex-column p-5">
                    <div className="d-flex justify-content-between">
                        <h2>Lista de organizaciones</h2>
                        <FlatButton
                            label="NUEVO"
                            btnStyle="primary"
                            size="xs"
                            icon={iconPlus}
                            iconPosition="end"
                            onclick={() => navigate('/organizaciones/registrar')}
                        />
                    </div>
                </div>
                <div className="container-lg">
                    <SimpleTable
                        columns={organizationsTableColumns}
                        data={tableRows}
                        getActions={getActions}
                    />
                </div>
            </div>
        </CommonLayout>
    );
};

export default OrganizationsPage;