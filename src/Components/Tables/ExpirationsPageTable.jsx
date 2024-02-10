import React, {useState} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {MRT_Localization_ES} from 'material-react-table/locales/es';
import './styles.scss';
import {SingleOptionChooser} from '../OptionsChooser/SingleOptionChooser';
import {getListaEstados} from '@/utils/util';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedStatus} from '@/Pages/ExpirationControlPage/actions';


const ExpirationsPageTable = ({columns, data, getActions}) => {
    const dispatch = useDispatch();
    const sourceSelected = useSelector(state => state.expirationsPage?.selectedStatus);

    const setSourceSelected = status => dispatch(setSelectedStatus(status));

    const renderRowActions = (data) => {
        const {row} = data;
        return getActions(row);
    };

    const initialTableState = {
        showColumnFilters: false,
        showGlobalFilter: true,
        density: 'compact',
        pagination: {
            pageIndex: 0,
            pageSize: 10
        }
    };

    const Table = () => React.useMemo(() => (
        <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnOrdering
            enableColumnFilters={false}
            enablePagination
            enableSelectAll={false}
            initialState={initialTableState}
            localization={MRT_Localization_ES}
            enableRowActions
            renderRowActions={renderRowActions}
            positionActionsColumn={'last'}
            muiTableHeadCellProps={{
                align: 'center'
            }}
            muiTableBodyCellProps={{
                sx: {
                    border: 'none'
                },
                align: 'center'
            }}
            paginationDisplayMode="pages"
            muiTableContainerProps={{sx: {height: '100%'}}}
        />
    ), [columns, data, initialTableState]);

    const StatusSelector = ({sourceSelected, setSourceSelected}) => {

        const listaEstados = getListaEstados();
        const Sources = () =>
            <SingleOptionChooser
                options={listaEstados}
                optionSelected={sourceSelected}
                onOptionSelected={setSourceSelected}
                disabled={false}
                idKey={'id'}
                valueKey={'value'}
            />;

        return (
            <div className={`d-flex flex-row flex-nowrap justify-content-end mt-3`} id="radioGroupeModalidad">
                <Sources/>
            </div>
        );
    };


    return (sourceSelected && data &&
        (
            <div
                className="initial-page-table table-container d-flex flex-fill flex-column justify-content-center align-items-center">
                <div className={'d-flex flex-row flex-wrap justify-content-end align-items-center w-100'}>
                    <div
                        className="source-selector flex-column bg-body-tertiary rounded-top ms-sm-auto ms-xxl-0 px-4 py-2">
                        <StatusSelector
                            setSourceSelected={setSourceSelected}
                            sourceSelected={sourceSelected}
                        />
                    </div>
                </div>
                <div className="align-items-center w-100 pt-3">
                    <Table/>
                </div>
            </div>
        )

    );
};

export default ExpirationsPageTable;