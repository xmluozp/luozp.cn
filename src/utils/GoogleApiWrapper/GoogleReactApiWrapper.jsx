import React, {useState} from 'react';
import { compose, withProps } from "recompose"
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import styles from './GoogleReactApiWrapper.module.scss';


export default () => {

    const [isAddressOpen, setIsOpen] = useState(false)
    return  window.google?<MyGoogleComponent isAddressOpen = {isAddressOpen} setIsOpen = {setIsOpen} />:null;
}

const MyGoogleComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB-SzNmMsKcB1oGDhV8gUJ6EVxYt7yJl78&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),

    withGoogleMap
)(({isAddressOpen, setIsOpen}) => {

    return <GoogleMap
        defaultOptions={{
            styles: mapstyles,
            mapTypeControl: false,
            zoomControl: false,
            fullscreenControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_TOP
            },
            streetViewControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_TOP
            }
        }}
        defaultZoom={14}
        defaultCenter={{ lat: 49.887, lng: -97.1401478 }}

    >
        <Marker
            position={{ lat: 49.8866903, lng: -97.1401478 }}
            onClick={() => {
                setIsOpen(!isAddressOpen);
            }}
        />
        {isAddressOpen && <InfoBox
            defaultPosition={new window.google.maps.LatLng(49.8866003, -97.1401478)}
            options={{ closeBoxURL: ``, enableEventPropagation: true, alignBottom:true, pixelOffset: new window.google.maps.Size(-100, -43) }}>
            {myAddress}
        </InfoBox>}
    </GoogleMap>
}

);


// export default GoogleApiWrapper({
//     apiKey: ("AIzaSyB-SzNmMsKcB1oGDhV8gUJ6EVxYt7yJl78")
// })(MapContainer)

const myAddress = <div className={styles.infoContainer}>
    <div className={styles.popup}>
        I do live here. Just don't want to put address online. Sorry...
    </div>
</div>


const mapstyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2d303a"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#746855"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#242f3e"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#263c3f"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6b9a76"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#38414e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#212a37"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9ca5b3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a89c66"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#1f2835"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#f3d19c"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2f3948"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#43ddf8"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#5e9cbd"
            },
            {
                "lightness": -20
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#515c6d"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#17263c"
            }
        ]
    }
];