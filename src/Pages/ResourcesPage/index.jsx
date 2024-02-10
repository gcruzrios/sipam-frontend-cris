import React, {useEffect, useState} from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {SearchField} from '@/Components/Fields/SearchField';
import useApi from '../../App/hooks/useApi';
import {getListaRecursos} from '@/server/api';
import {useSelector} from 'react-redux';
import SimpleTable from '@/Components/Tables/SimpleTable';

const iconPlus = <FontAwesomeIcon icon={faPlus}/>;
const ResourcesPage = () => {
    const navigate = useNavigate();
    const api = useApi();
    const isAppReady = useSelector(state => state.root?.isAppReady);
    const [resourcesList, setResourcesList] = useState([]);

    useEffect(() => {
        if (isAppReady) {
            api.request(getListaRecursos).then(
                resources => {
                    if (resources && resources.CodigoResultado === '00' && resources.Resultado) {
                        setResourcesList(resources.Resultado);
                    } else {
                        setResourcesList([]);
                    }
                });
        }
    }, [isAppReady]);

    const getActions = ({idRecurso}) =>
        <div className="text-nowrap">
            <FlatButton btnStyle={'danger'} label={'Eliminar'} size={'xs'} outline className={'m-1'}/>
            <FlatButton btnStyle={'secondary'} label={'Editar'} size={'xs'} outline className={'m-1'}/>
            <FlatButton btnStyle={'info'} label={'Ver Más'} size={'xs'} outline className={'m-1'}/>
        </div>;

    const tableRows = React.useMemo(() => resourcesList?.map(
        ({idRecurso, annioRecurso, nombreLey, nombrePrograma, montoRecurso, nombreRecurso}) => ({
            idRecurso,
            name: nombreRecurso,
            law: nombreLey,
            amount: montoRecurso,
            year: annioRecurso,
            program: nombrePrograma,
        })
    ), [resourcesList]);

    const columns = [
        {
            header: 'Nombre Recurso',
            accessorKey: 'name',
        },
        {
            header: 'Monto',
            accessorKey: 'amount',
        },
        {
            header: 'Año',
            accessorKey: 'year',
        },
        {
            header: 'Programa',
            accessorKey: 'program',
        },
    ];

    return (
        <CommonLayout>
            <div className="bg-light flex-fill">
                <div className="d-flex flex-column form-header p-5">
                    <div className="d-flex justify-content-between">
                        <h2>Recursos</h2>
                        <FlatButton
                            label="NUEVO"
                            btnStyle="primary"
                            size="xs"
                            icon={iconPlus}
                            iconPosition="end"
                            onclick={() => navigate('/recursos/registrar')}
                        />
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-md-6 col-lg-4">
                            <SearchField
                                onChange={() => console.log('search')}
                                placeholder="Digita un nombre"
                                style="dark"
                            />
                        </div>
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

export default ResourcesPage;