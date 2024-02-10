import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import {randomUID} from '@/utils/util';

const RadioOption = ({index, name, value, optionSelected, onOptionSelected, label, disabled}) => {
    const uuid = randomUID();
    return (
        <div className="form-check form-check-inline"
             key={index}>
            <input
                className="form-check-input"
                type="radio"
                name={name}
                id={uuid}
                value={uuid}
                checked={optionSelected === value}
                onChange={() => onOptionSelected(value)}
                disabled={!!disabled}
            />
            <label className="form-check-label"
                   htmlFor={uuid}>
                {label}
            </label>
        </div>
    )
}

export const SingleOptionChooser = ({options, name, optionSelected, onOptionSelected, disabled, idKey, valueKey}) => {
    return options.filter(source => (source.estado === 'A' || source.Estado === 'A')).map(
        (source, index) => {
            const value = R.prop(idKey, source);
            const label = R.prop(valueKey, source);
            return (
                <RadioOption
                    key={index}
                    name={name}
                    value={value}
                    optionSelected={optionSelected}
                    onOptionSelected={onOptionSelected}
                    label={label}
                    disabled={disabled}
                />
            );
        });
};

SingleOptionChooser.propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    optionSelected: PropTypes.string,
    onOptionSelected: PropTypes.func,
    disabled: PropTypes.bool,
    idKey: PropTypes.string,
    valueKey: PropTypes.string,

};