import React from 'react';
import PropTypes from 'prop-types';
export const YesNoSelector = ({register, ...props}) => {
    return (
    <select {...props} {...register}>
        <option value='S'>Si</option>
        <option value='N'>No</option>
    </select>
    );
};

YesNoSelector.propTypes = {
    register: PropTypes.object
}