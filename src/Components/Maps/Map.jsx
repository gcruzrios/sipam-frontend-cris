import React from 'react';
import {GoogleMap, useJsApiLoader} from '@react-google-maps/api';
import PropTypes from 'prop-types';
import {GOOGLE_MAP_API_KEY} from '@/store/model';

export const defaultMarker = {
    name: 'Current position',
    position: {
        lat: 9.936701,
        lng: - 84.098954
    }
};
function MapComponent({children, center, zoom = 15, containerStyle}) {
    const defaultContainerStyle = {
        width: '500px',
        height: '500px',
        ...containerStyle
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAP_API_KEY
    });
    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, [setMap]);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, [setMap]);

    return isLoaded ? (
        <GoogleMap
            zoom={zoom}
            mapContainerStyle={defaultContainerStyle}
            center={center}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {children}
        </GoogleMap>
    ) : <></>;
}

MapComponent.propTypes = {
    children: PropTypes.any,
    center: PropTypes.object,
    zoom: PropTypes.number,
    containerStyle: PropTypes.object
};

export default React.memo(MapComponent);