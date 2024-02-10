import React from 'react';
import PropTypes from 'prop-types';
import {concat} from 'ramda';


const BasicTableComponent = ({headerGroups, rows, getTableProps, getTableBodyProps, prepareRow, className}) => {

    return (
        <table className={concat('table ', className)} {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup, i) => i > 0 && (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                        {headerGroup.headers.map((column, j) => (
                            <th {...column.getHeaderProps()} key={`${i}-${j}`}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={i}>
                            {row.cells.map((cell, j) => {
                                return <td {...cell.getCellProps()} key={`${i}-${j}`}>{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};


BasicTableComponent.propTypes = {
    headerGroups: PropTypes.array,
    rows: PropTypes.array,
    getTableProps: PropTypes.func,
    getTableBodyProps: PropTypes.func,
    prepareRow: PropTypes.func,
    className: PropTypes.string,
};

export default BasicTableComponent;