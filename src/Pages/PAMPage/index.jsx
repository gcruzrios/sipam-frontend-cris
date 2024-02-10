import React, {useState} from 'react';
import CommonLayout from '../../Containers/CommonLayout';
import {useNavigate} from 'react-router-dom';
import {SearchField} from '@/Components/Fields/SearchField';
import PreviewTable from '../../Components/Tables/PreviewTable';
import {equals, range} from 'ramda';
import {fullname} from 'react-lorem-ipsum';
import {FlatButton} from '@/Components/Buttons/FlatButton';
import {ModalidadSelector} from '@/Components/OptionsChooser/ModalidadSelector';
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {getUserRole} from '@/App/hooks/useAuth';
import {When} from '@/utils/util';
import {ROLE_ORG} from '@/store/model';

const PAMPage = () => {
    const navigate = useNavigate();
    const iconPlus = <FontAwesomeIcon icon={faPlus}/>;
    const userRole = React.useMemo(() => getUserRole(), []);
    const getName = () => fullname('all');

    const rand = (min, max) => Math.floor(min + Math.random() * (max - min));

    const identification = ['1050897657', '1050897657', '1050897657', '1050897657'];
    const getIdentification = () => identification[rand(0, identification.length - 1)];

    const identificationType = ['1', '1', '1', '1'];
    const getIdentificationType = () => identificationType[rand(0, identificationType.length - 1)];

    const state = ['Activo', 'Activo', 'Activo', 'Activo'];
    const getState = () => state[rand(0, state.length - 1)];

    const modality = ['Red', 'Hogar', 'Abandonados', 'Red/CD'];
    const getModality = () => modality[rand(0, modality.length - 1)];

    const getActions = () => (
        <div className="flex-row">
            <FlatButton
                btnStyle={'info'}
                label={'Ver Más'}
                size={'xs'}
                outline
                className={'m-1'}
            />
        </div>
    );

    const data = range(1, 101).map((n) => {
        const name = getName();

        return {
            name: name,
            identification: getIdentification(),
            identificationType: getIdentificationType(),
            state: getState(),
            modality: getModality(),
            actions: getActions(),
        };
    });

    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'name',
        },
        {
            header: 'Tipo identificación',
            accessorKey: 'identificationType',
        },
        {
            header: 'Identificación',
            accessorKey: 'identification',
        },
        {
            header: 'Estado',
            accessorKey: 'state',
        },
        {
            header: 'Modalidad',
            accessorKey: 'modality',
        },
        {
            header: 'Acciones',
            accessorKey: 'actions',
        }
    ];

    const [sourceSelected, setSourceSelected] = useState('1');
    const modalities = useSelector(state => state.root.modalidades);

    const handleSourceSelected = (source) => {
        setSourceSelected(source);
    };

    return (
        <CommonLayout>
            <div className="bg-light flex-fill p-5">
                <div className="d-flex flex-column">
                    <h2>Persona Adulto Mayor</h2>
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <SearchField
                                onChange={() => console.log('search')}
                                placeholder="Digita un nombre"
                                style="dark"
                            />
                        </div>
                        <When condition={userRole && equals(userRole, ROLE_ORG)}>
                            <div className="col-12 col-md-6 col-lg-8 d-flex">
                                <FlatButton
                                    label="NUEVO"
                                    className={'ms-auto'}
                                    btnStyle="primary"
                                    size="xs"
                                    icon={iconPlus}
                                    iconPosition="end"
                                    onclick={() => navigate('/pam/registrar')}
                                />
                            </div>
                        </When>
                    </div>

                    <div className="col form-row mt-4">
                        <ModalidadSelector
                            sources={modalities}
                            sourceSelected={sourceSelected}
                            onSourceSelected={handleSourceSelected}
                            position={'end'}
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <PreviewTable
                        columns={columns}
                        data={data}
                        title={'Presupuesto Ordinario'}
                        onButtonClick={null}
                    />
                </div>

                <div className="mt-5">
                    <PreviewTable
                        columns={columns}
                        data={data}
                        title={'Presupuesto Extraordinario'}
                        onButtonClick={null}
                    />
                </div>

                <div className="mt-5">
                    <PreviewTable
                        columns={columns}
                        data={data}
                        title={'Medición 1'}
                        onButtonClick={null}
                    />
                </div>

                <div className="mt-5">
                    <PreviewTable
                        columns={columns}
                        data={data}
                        title={'Activos Posibles Beneficiarios'}
                        onButtonClick={null}
                    />
                </div>

                <div className="d-flex justify-content-end mt-5">
                    <FlatButton
                        label="Generar Reporte"
                        btnStyle="primary"
                        type="submit"
                    />
                </div>
            </div>
        </CommonLayout>
    );
};

export default PAMPage;