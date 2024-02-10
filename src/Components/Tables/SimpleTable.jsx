import React from 'react';
import './styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import {MRT_Localization_ES} from 'material-react-table/locales/es';
import {MaterialReactTable} from 'material-react-table';
import {saveFilterValue} from '@/store/root/actions';


// eslint-disable-next-line react/prop-types
const SimpleTable = ({columns, data, getActions, initialTableStateProps}) => {
    const dispatch = useDispatch();

    const onChangeFilterHandler = (value) => {
        dispatch(saveFilterValue(value));
    };

    const filterValue = useSelector(state => state?.root?.filterValue || '');

    const renderRowActions = (data) => {
        return getActions(data.row?.original);
    };

    const initialTableState = {
        showColumnFilters: false,
        showGlobalFilter: true,
        pagination:{
            pageIndex: 0,
            pageSize:5
        },
        ...initialTableStateProps
    };

    return (
        (
            <div className="simple-table table-container">
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    enableColumnResizing
                    enableHiding
                    columnResizeMode={'onChange'}
                    layoutMode={'semantic'}
                    enableColumnOrdering
                    enableColumnFilters={false}
                    enablePagination
                    enableSelectAll={false}
                    initialState={initialTableState}
                    localization={MRT_Localization_ES}
                    enableRowActions={!!getActions}
                    renderRowActions={!!getActions && renderRowActions}
                    positionActionsColumn={'last'}
                    muiTableBodyCellProps={{
                        sx: {
                            border: 'none'
                        }
                    }}
                    paginationDisplayMode="pages"
                    onGlobalFilterChange={onChangeFilterHandler}
                    state={{globalFilter: filterValue}}
                />
            </div>
        )

    );
};

export default SimpleTable;