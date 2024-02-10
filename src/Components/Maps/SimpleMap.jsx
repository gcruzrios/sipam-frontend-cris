import React from 'react';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

function MapComponent() {
    const center = {
        lat: 9.936701,
        lng: - 84.098954
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAdVwEohok7Q6HzafZrxdSr0TN85HTymgY'
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const mapState = {
        markers: [
            {
                name: 'Current position',
                position: {
                    lat: 9.936701,
                    lng: - 84.098954
                }
            }
        ]
    };

    const onMarkerDragEnd = (event, index) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();

        const markers = [...mapState.markers];
        markers[index] = { ...markers[index], position: { lat, lng } };
        return { markers };
    };

    const Markers = () => mapState.markers.map((marker, index) =>
        <Marker
            key={index}
            position={marker.position}
            draggable={true}
            onDragEnd={(event) => onMarkerDragEnd(event, index)}
            name={marker.name}
        />
    );

    return isLoaded ? (
        <GoogleMap
            zoom={15}
            mapContainerStyle={containerStyle}
            center={center}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <>
                <Markers/>
            </>
        </GoogleMap>
    ) : <></>;
}

export default React.memo(MapComponent);