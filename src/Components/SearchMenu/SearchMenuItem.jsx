import React from 'react';
import PropTypes from 'prop-types';
import {IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {When} from '@/utils/util';
import {getUserRole} from '@/App/hooks/useAuth';
import {equals, not} from 'ramda';
import {ROLE_ADMIN, ROLE_ORG} from '@/store/model';

export const SearchMenuItem = (
    {
        name,
        identifier,
        id,
        recordType,
        navigate
    }
) => {
    const goTo = () => {
        if (recordType === 'PAM') {
            navigate(`pam/ver/${identifier}`);
        } else if (recordType === 'OBS') {
            navigate(`organizaciones/ver/${id}`);
        }
    };

    const edit = (event) => {
        event.stopPropagation();
        if (recordType === 'PAM') {
            navigate(`pam/editar/${identifier}`);
        } else if (recordType === 'OBS') {
            navigate(`organizaciones/editar/${id}`);
        }
    };

    const userRole = getUserRole();

    const shouldEdit = React.useMemo(() => {
        return equals(recordType, 'PAM') && equals(userRole, ROLE_ORG) || equals(recordType, 'OBS') && equals(userRole, ROLE_ADMIN)
    }, [recordType, userRole]);

    const shouldSee = React.useMemo(() => {
        return not(equals(recordType, 'OBS') && equals(userRole, ROLE_ORG));
    }, [recordType, userRole]);

    return (
        <a className="search-item list-group-item list-group-item-primary list-group-item-action fade show"
            onClick={shouldSee ? goTo : undefined}>
            <div
                className="w-100 d-flex flex-row flex-fill py-2 px-4">
                <div className="d-flex flex-column align-items-start me-5">
                    <p className="fw-bold fs-6 m-0">{name}</p>
                    <p className="p-0 m-0 fw-light">{identifier}</p>
                </div>
                <When condition={shouldEdit}>
                    <div className="ms-auto">
                        <IconButton aria-label="delete" className="" size="small" color="inherit" onClick={edit}>
                            <EditIcon/>
                        </IconButton>
                    </div>
                </When>
            </div>
        </a>
    );
};

SearchMenuItem.propTypes = {
    name: PropTypes.string,
    identifier: PropTypes.string,
    id: PropTypes.string,
    recordType: PropTypes.string,
    navigate: PropTypes.func
};