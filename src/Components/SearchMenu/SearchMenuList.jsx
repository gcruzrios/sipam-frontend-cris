import React from 'react';
import PropTypes from 'prop-types';
import {SearchMenuItem} from './SearchMenuItem';

export const SearchMenuList = ({items, navigate}) => {
    return (
        <div className="list-group">
            {
               items.map(
                   (item, index) => <SearchMenuItem {...item} navigate={navigate} key={index}/>
               )
            }
        </div>);
    };

SearchMenuList.propTypes = {
    items: PropTypes.array,
    navigate: PropTypes.func
}