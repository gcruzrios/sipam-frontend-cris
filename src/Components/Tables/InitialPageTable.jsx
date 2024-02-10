import React, {useEffect, useState} from 'react';
import {MaterialReactTable} from 'material-react-table';
import {MRT_Localization_ES} from 'material-react-table/locales/es';
import {ModalidadSelector} from '../OptionsChooser/ModalidadSelector';
import './styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import {changeSourceSelected} from '@/Pages/InitialPage/actions';
import {When} from '@/utils/util';


const InitialPageTable = ({columns, data, title, enableSourceSelector, getActionsFn}) => {
        const dispatch = useDispatch();

        const sourceSelected = useSelector(state => state.initialPage?.sourceSelected);
        const modalities = useSelector(state => state.root.modalidades);
        const handleSourceSelected = (source) => {
            dispatch(changeSourceSelected(source));
        };

        const renderRowActions = ({row}) => {
            return getActionsFn(row.original);
        };

        const initialTableState = {
            showColumnFilters: false,
            showGlobalFilter: true,
            density: 'compact',
            pagination: {
                pageIndex: 0,
                pageSize: 5
            }
        };

        const [tableState, setTableState] = useState(initialTableState);

        const savedTableState = useSelector(state => state.initialPage?.tableState);

        useEffect(() => {
            setTableState(savedTableState);
        }, [savedTableState]);


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
                muiTableBodyCellProps={{
                    sx: {
                        border: 'none'
                    }
                }}
                paginationDisplayMode="pages"
            />
        ), [columns, data, initialTableState]);


        return (sourceSelected && modalities && data &&
            (
                <div
                    className="initial-page-table table-container d-flex flex-fill flex-column justify-content-center align-items-center">
                    <div className={'d-flex flex-row flex-wrap justify-content-between align-items-center w-100'}>
                        <div className="flex-column me-auto">
                            <h3>
                                {title} <span className="text-light">|</span> Inicio
                            </h3>
                        </div>
                        <div className="flex-column">

                        </div>
                        <When condition={enableSourceSelector}>
                            <div
                                className="source-selector flex-column bg-body-tertiary rounded-top ms-sm-auto ms-xxl-0 px-4 py-2">
                                <ModalidadSelector
                                    sources={modalities}
                                    sourceSelected={sourceSelected}
                                    onSourceSelected={handleSourceSelected}
                                    position={'end'}/>
                            </div>
                        </When>
                    </div>
                    <div className="align-items-center w-100 bg-white rounded-top px-3 pt-3">
                        <Table/>
                    </div>
                </div>
            )

        );
    }
;

export default InitialPageTable;