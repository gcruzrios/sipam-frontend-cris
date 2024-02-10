import React from 'react';
import bg from '../../../assets/images/indexBackground.png';
import CommonLayout from '../../../Containers/CommonLayout';
import SimpleTable from '../../../Components/Tables/SimpleTable';
import {range} from 'ramda';
import { fakerES as faker } from '@faker-js/faker';

const ExpirationsControlList = () => {
    const columns = [
        {
            header: 'Código OBS/GL',
            accessorKey: 'codigoObsGl',
            enableHiding: false,
        },
        {
            header: 'Cédula Jurídica',
            accessorKey: 'cedulaJuridica',
            enableHiding: false,
        },
        {
            header: 'OBS/GL',
            accessorKey: 'obsGl',
            enableHiding: false,
        },
        {
            header: 'Personería Fecha I',
            accessorKey: 'personeriaFechaI',
        },
        {
            header: 'Personería Fecha V',
            accessorKey: 'personeriaFechaV',
        },
        {
            header: 'Idoniedad Fecha I',
            accessorKey: 'idoniedadFechaI',
            hidden: true
        },
        {
            header: 'Idoniedad Fecha V',
            accessorKey: 'idoniedadFechaV',
            hidden: true
        },
        {
            header: 'Habilitación Fecha I',
            accessorKey: 'habilitacionFechaI',
            hidden: true
        },
        {
            header: 'Habilitación Fecha V',
            accessorKey: 'habilitacionFechaV',
            hidden: true
        },
        {
            header: 'C.C.S.S',
            accessorKey: 'ccss',
            hidden: true
        },
        {
            header: 'Ley 9188 (8783) Red cuido',
            accessorKey: 'ley9188',
            hidden: true
        },
        {
            header: 'Ley 7972 Red cuido',
            accessorKey: 'ley7972',
            hidden: true
        },
        {
            header: 'Ley 8783 Abandonados',
            accessorKey: 'ley8783',
            hidden: true
        },
    ];

    const data = range(0, 10).map(
        () => ({
            codigoObsGl: faker.number.int({min: 100000, max: 99999999}),
            cedulaJuridica: faker.number.int({min: 100000, max: 99999999}),
            obsGl: faker.company.name(),
            personeriaFechaI: faker.date.anytime().toDateString(),
            personeriaFechaV: faker.date.anytime().toDateString(),
            idoniedadFechaI: faker.date.anytime().toDateString(),
        })
    )

    return (
        <CommonLayout style={{backgroundImage: `url(${bg})`}}>
            <div className="container-fluid d-flex flex-fill flex-column bg-semi-50 p-0 m-0">
                <div className="d-flex flex-column p-5">
                    <div className="d-flex justify-content-between">
                        <h2>Control de Vencimientos</h2>
                    </div>
                </div>
                <div className="container-lg">
                    <SimpleTable
                        columns={columns}
                        data={data}
                        initialTableStateProps={{
                            columnVisibility: {
                                idoniedadFechaI: false,
                                idoniedadFechaV: false,
                                habilitacionFechaI: false,
                                habilitacionFechaV: false,
                                ccss: false,
                                ley9188: false,
                                ley7972: false,
                                ley8783: false
                            }
                        }}
                    />
                </div>
            </div>
        </CommonLayout>);
};

export default ExpirationsControlList;