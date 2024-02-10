import React from 'react';
import './styles.scss';
import {MRT_Localization_ES} from 'material-react-table/locales/es';
import {MaterialReactTable} from 'material-react-table';


// eslint-disable-next-line react/prop-types
const CompactTable = ({columns, data, getActions}) => {

    const renderRowActions = (data) => {
        return getActions(data.row?.original);
    };

    const initialTableState = {
        showColumnFilters: false,
        showGlobalFilter: false,
    };

    return (
        (
            <div className="simple-table table-container w-100">
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    enableTopToolbar={false}
                    enableBottomToolbar={false}
                    enablePagination={false}
                    enableColumnDragging={false}
                    enableColumnResizing={true}
                    layoutMode={'semantic'}
                    enableSelectAll={false}
                    initialState={initialTableState}
                    localization={MRT_Localization_ES}
                    enableRowActions
                    enableStickyHeader
                    renderRowActions={renderRowActions}
                    positionActionsColumn={'last'}
                    muiTableBodyCellProps={{
                        sx: {
                            border: 'none',
                            padding: '10px',
                        }
                    }}
                    muiTableContainerProps={({table}) => (
                        {
                            sx: {
                                maxHeight: `180px`
                            }
                        })}
                    muiTablePaperProps={
                        {
                            sx: {
                                height: '100%'
                            }
                        }}
                />
            </div>
        )

    );
};

export default CompactTable;