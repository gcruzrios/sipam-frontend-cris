import  './styles.scss';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loading from '../Components/Loading';
import useApi from '../App/hooks/useApi';
import { useSelector } from 'react-redux';

function CommonLayout({children, style}) {
    const isLoading = useSelector(state => state.root.isLoading);
    const { loading } = useApi();
    const isReady = useSelector(state => state.root.isAppReady);

    const [isLoadingView, setIsLoadingView] = useState(false);

    useEffect(() => {
        setIsLoadingView(isLoading || loading || !isReady);
    }, [isLoading, loading, isReady]);

    return (
        <div className="layout-common shadow-sm d-flex" style={style}>
            {  isLoadingView &&
                <Loading/>
                }
            {children}
        </div>
    );
}

CommonLayout.propTypes = {
    children: PropTypes.node,
    style: PropTypes.any
};

export default CommonLayout;
