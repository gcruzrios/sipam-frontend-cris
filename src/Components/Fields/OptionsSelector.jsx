import React from 'react';
import PropTypes from 'prop-types';

const OptionsSelector = (props) => {
    const { options, placeholder } = props;
    const OptionList = () => options.map(
        (option, index) =>
            <option key={index} value={option.id}>{option.value}</option>
    );

    return (
    <select {...props} >
        {placeholder && <option value={null}>{placeholder}</option>}
        <OptionList/>
    </select>);
};

OptionsSelector.propTypes = {
    options: PropTypes.array,
    placeholder: PropTypes.string
};

export default OptionsSelector;