import React, {useEffect} from 'react';
import {Marker, useJsApiLoader} from '@react-google-maps/api';
import Map, {defaultMarker} from './Map';

export const EditableMapComponent = ({marker, editable, onMarkerChange}) => {

    const [mapMarker, setMapMarker] = React.useState(defaultMarker);

    useEffect(() => {
        if (marker) {
            setMapMarker(marker);
        }
    }, [marker]);

    const center = React.useMemo(() => {
        if(mapMarker && mapMarker?.position) {
            return mapMarker?.position;
        }

        return {
            lat: 9.936701,
            lng: -84.098954
        };
    },[mapMarker]);

    const onMarkerDragEnd = (event) => {
        if(!editable) return;
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();

        setMapMarker({...marker, position: { lat, lng }});
        onMarkerChange && onMarkerChange({lat, lng});
    };

    const Markers = () =>
        <Marker
            position={mapMarker?.position}
            draggable={editable}
            onDragEnd={(event) => onMarkerDragEnd(event)}
            name={mapMarker?.name}
        />;

    return (
        <Map center={center}>
            <>
                {mapMarker && (
                    <Markers/>
                )}
            </>
        </Map>
    );
};