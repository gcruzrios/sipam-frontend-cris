import React, {useEffect, useRef, useState} from 'react';
import {InfoBox, Marker} from '@react-google-maps/api';
import Map from './Map';
import {wait} from '@/utils/util';

export const MapWithMarkers = ({markers, zoom, onMarkerClick, mapContainerStyle}) => {

    const [mapMarkers, setMapMarker] = React.useState([]);

    useEffect(() => {
        if (markers) {
            setMapMarker(markers);
        }
    }, [markers]);

    const center = () => {
        if (mapMarkers && mapMarkers.length > 0) {
            return mapMarkers[0].position;
        }

        return {
            lat: 9.936701,
            lng: -84.098954
        };
    };

    if (mapMarkers && mapMarkers.length) {
        const m1 = mapMarkers[0];
        center.lat = m1.lat;
        center.lng = m1.lng;
    }

    const MarkerComponent = ({marker, index}) => {
        const [showInfo, setShowInfo] = React.useState(false);
        return (
            <Marker
                key={index}
                position={marker.position}
                draggable={false}
                name={marker.name}
                title={marker.name}
                onClick={(event) => {
                    onMarkerClick && onMarkerClick({event, marker, index});
                }}
                onMouseOver={() => setShowInfo(true)}
                onMouseOut={async () => {
                    wait(300).then(
                        () => setShowInfo(false)
                    );

                }}
                optimized={false}

            >
                {showInfo &&
                    <InfoBox options={{closeBoxURL: ''}} position={marker.position} key={`info-${index}`}>
                        <div className={'card p-3'}>{marker.name}</div>
                    </InfoBox>
                }

            </Marker>);
    };


    const Markers = () => mapMarkers.map((marker, index) =>
        <MarkerComponent marker={marker} index={index} key={index}/>
    );

    return (<Map center={center()} zoom={zoom} containerStyle={mapContainerStyle}>
        <>
            {mapMarkers && mapMarkers.length > 0 && (
                <>
                    <Markers/>
                </>
            )}
        </>
    </Map>);
};