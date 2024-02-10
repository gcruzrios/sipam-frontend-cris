import React from 'react';
import PropTypes from 'prop-types';
import {SingleOptionChooser} from './SingleOptionChooser';
import {MultiOptionChooser} from './MultiOptionChooser';

export const PermisosSelector = ({sources, sourceSelected, onSourceSelected, position, disabled}) => {
    const Sources = () =>
        <MultiOptionChooser
            options={sources}
            optionsSelected={sourceSelected}
            onOptionSelected={onSourceSelected}
            disabled={disabled}
            idKey={'idPermiso'}
            valueKey={'nombrePermiso'}
        />;

    return (
        <div className={`d-flex flex-row flex-nowrap justify-content-${position} mt-3`} id="radioGroupeModalidad">
            <Sources/>
        </div>
    );
};

PermisosSelector.propTypes = {
    source: PropTypes.string,
    onSourceSelected: PropTypes.func,
    position: PropTypes.oneOf([
        'end',
        'start',
        'center',
        'between'
    ]),
    disabled: PropTypes.bool
};