import React from 'react';
import {SearchField} from '../Fields/SearchField';
import PropTypes from 'prop-types';
import {asyncDebounce} from '@/utils/util';

const GlobalFilter = ({
                          globalFilter,
                          setGlobalFilter,
                          onChangeFilterHandler,
                          filterValue
                      }) => {
    const [value, setValue] = React.useState(globalFilter || filterValue || '');
    const onChange = asyncDebounce(value => {
        setGlobalFilter(value || undefined);
        onChangeFilterHandler && onChangeFilterHandler(value);
    }, 500);

    return (
        <div>
            <SearchField
                style={'dark'}
                value={value}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={'Busqueda'}
            />
        </div>
    );
};

GlobalFilter.propTypes = {
    globalFilter: PropTypes.string,
    setGlobalFilter: PropTypes.any,
    onChangeFilterHandler: PropTypes.func,
    filterValue: PropTypes.string
};

export default GlobalFilter;