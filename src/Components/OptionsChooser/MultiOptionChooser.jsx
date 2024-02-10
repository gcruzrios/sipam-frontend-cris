import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

export const MultiOptionChooser = ({options, optionsSelected, onOptionSelected, disabled, idKey, valueKey}) => {

    const selections = React.useMemo(() => {
        return  R.split(' | ', optionsSelected);
    }, [optionsSelected]);

    const handleSelection = (id, event) => {
        const checked = event.target.checked;
        const newSelections = checked ? R.append(id, selections) : R.filter(v => v !== id, selections);
        const optionsSelected = newSelections.filter(v => v !== '').join(' | ');
        onOptionSelected(optionsSelected);
    };

    return options.map(
        (source, index) => {
            const id = R.prop(idKey, source);
            const value = R.prop(valueKey, source);
            return (
                (source.estado === 'A' || source.Estado === 'A') &&
                <div className="form-check form-check-inline"
                     key={index}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name={`checkbox-option-${value}`}
                        id={`option-${value}`}
                        value={value}
                        checked={R.includes(id, selections)}
                        onChange={(event) => handleSelection(id, event)}
                        disabled={!!disabled}
                    />
                    <label className="form-check-label"
                           htmlFor={`option-${value}`}>{value}</label>
                </div>
            );
        });
};

MultiOptionChooser.propTypes = {
    options: PropTypes.array,
    optionsSelected: PropTypes.string,
    onOptionSelected: PropTypes.func,
    position: PropTypes.oneOf([
        'end',
        'start',
        'center',
        'between'
    ])
};