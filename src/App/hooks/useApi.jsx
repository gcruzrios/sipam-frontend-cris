import React, {createContext} from 'react';
import PropTypes from 'prop-types';

const apiContext = createContext({});

const useApi = () => {
    const [loading, setLoading] = React.useState(false);

    const request = async(apiFunc, ...args) => {
        setLoading(true);
        try {
            return await apiFunc(...args);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        request
    };
};

export const ApiProvider = ({ children }) => {
    const api = useApi();
    return <apiContext.Provider value={api}>{children}</apiContext.Provider>;
};

ApiProvider.propTypes = {
    children: PropTypes.any
};

export default function ApiConsumer() {
    return React.useContext(apiContext);
}