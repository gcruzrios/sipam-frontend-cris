import React from 'react';
import './styles.scss';
import {FlatButton} from '../Buttons/FlatButton';
import SimpleTable from './SimpleTable';

// eslint-disable-next-line react/prop-types
const PreviewTable = ({columns, data, title, onButtonClick}) => {
    const Table = () => {
        return(
            <SimpleTable
                columns={columns}
                data={data}
            />
        );
    }

    return (
        (
            <div
                className="simple-table table-container d-flex flex-fill flex-column justify-content-center align-items-center">
                <div className={'d-flex flex-row flex-wrap justify-content-between align-items-center w-100'}>
                    <h3 className={'mb-4'}>
                        {title}
                    </h3>
                </div>
                <div className="d-flex flex-column align-items-center w-100 bg-white rounded-top px-3 pt-3 mb-4">
                    <Table/>
                </div>
                <FlatButton
                    label="Ver más"
                    btnStyle={'info'}
                    size="sm"
                    outline
                    onclick={onButtonClick}
                />
            </div>
        )

    );
};

export default PreviewTable;