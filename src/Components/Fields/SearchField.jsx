import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import {SearchMenuModal} from '../Modals/SearchMenuModal';
import {isEmpty} from 'ramda';
import PropTypes from 'prop-types';
import {SearchMenuItem} from '../SearchMenu/SearchMenuItem';

export const SearchField = ({
                                onChange,
                                value,
                                placeholder = 'Buscar en el sitio',
                                style = 'light',
                                options,
                                searchItems,
                                navigate,
                                ...restProps
                            }) => {

    const iconSearch = <FontAwesomeIcon icon={faSearch}/>;
    const [hasOptions, setHasOptions] = useState(false);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setHasOptions(options && options.length > 0);
    }, [options]);

    useEffect(() => {
        setOpen(value && !isEmpty(searchItems) && !isEmpty(value));
    }, [searchItems, value]);

    return (
        <div className={`search-field search-field-${style} text-${style} border rounded-pill px-1 d-flex`}>
            <div className="input-group input-group-sm flex-nowrap">
                <span className={`input-group-text text-${style} border-0 bg-transparent`} id="addon-wrapping">
                    {iconSearch}
                </span>
                <input
                    className={`form-control me-2 text-${style} border-0 shadow-none ${style === 'light' ? 'bg-transparent' : 'bg-white'}`}
                    list={hasOptions ? 'datalistOptions' : undefined}
                    placeholder={placeholder}
                    aria-label="Buscar"
                    value={value}
                    onChange={onChange}
                    {...restProps}
                />
                {hasOptions && (
                    <datalist id="datalistOptions">
                        {options.map((option, index) =>
                            <option value={option} key={index}/>
                        )}
                    </datalist>
                )}
                {searchItems && !isEmpty(searchItems) && (
                    <SearchMenuModal
                        items={searchItems}
                        navigate={navigate}
                        open={open}
                        setOpen={setOpen}/>

                )}
            </div>
        </div>
    );
};

SearchField.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    style: PropTypes.string,
    options: PropTypes.array,
    searchItems: PropTypes.arrayOf(SearchMenuItem),
    navigate: PropTypes.func
};