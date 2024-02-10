import React from 'react';
import PropTypes from 'prop-types';
import {SingleOptionChooser} from './SingleOptionChooser';
import {randomUID} from '@/utils/util';
import {MultiOptionChooser} from '@/Components/OptionsChooser/MultiOptionChooser';

export const ModalidadSelector = ({sources, sourceSelected, onSourceSelected, position, disabled, multi}) => {
    const uuid = randomUID();
    const Sources = () =>
        multi ?
            <MultiOptionChooser
                options={sources}
                optionsSelected={sourceSelected}
                onOptionSelected={onSourceSelected}
                disabled={disabled}
                idKey={'idModalidad'}
                valueKey={'descripcion'}
            />
            :
            <SingleOptionChooser
                options={sources}
                optionSelected={sourceSelected}
                onOptionSelected={onSourceSelected}
                disabled={disabled}
                idKey={'idModalidad'}
                valueKey={'descripcion'}
            />;

    return (
        <div className={`d-flex flex-row flex-nowrap justify-content-${position} mt-3`} id={uuid}>
            <Sources/>
        </div>
    );
};

ModalidadSelector.propTypes = {
    source: PropTypes.string,
    onSourceSelected: PropTypes.func,
    position: PropTypes.oneOf([
        'end',
        'start',
        'center',
        'between'
    ]),
    multi: PropTypes.bool
};