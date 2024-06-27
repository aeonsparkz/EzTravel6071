import { useState } from "react";
import {
    Map,
    APIProvider,
    MapControl,
    ControlPosition,
    AdvancedMarker,
    useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";
import "./Googlemaps.css";
import PlacesAutocomplete from "./PlacesAutocomplete";
import MapHandler from "./MapHandler";
import supabase from '../supabaseClient';


type listOfLocationsProps = {
    name: string | undefined
    address: string | undefined
}

function Googlemaps(props: { trigger: any; setTrigger: (arg0: boolean) => void; extractData: (arg0:listOfLocationsProps[]) => void;}) {
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [placeId, setSelectedPlaceId] = useState("");
    const [selectedCoordinates, setSelectedCoordinates] = useState<google.maps.LatLng | null>(null);
    
    const handleMapClick = (mapProps : {
        type?: string;
        map?: google.maps.Map;
        detail: any;
        stoppable?: boolean;
        stop?: () => void;
        domEvent?:
          | Event
          | MouseEvent
          | TouchEvent
          | PointerEvent
          | KeyboardEvent
          | undefined;
     }) => {
        if (mapProps.detail.placeId) {
            const lat = mapProps.detail.latLng.lat;
            const lng = mapProps.detail.latLng.lng;
            setSelectedPlaceId(mapProps.detail.placeId);
            setSelectedCoordinates(new google.maps.LatLng({ lat, lng }));
        } else {
            alert("Please select the specific location");
        }
    };
    
    const [listOfLocations, setListOfLocations] = useState<listOfLocationsProps[]>([]);

    const addLocation = () => {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'))
        const request = {
            placeId: placeId,
            fields: ['name', 'formatted_address']
        }

        service.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place != null) {
                setListOfLocations((listOfLocations) => [
                    ...listOfLocations,
                    { address: place.formatted_address, name: place.name },
                ]);
            }
        });
    }


    const handleDeleteLocation = (e: string | undefined) => {
        let removed = false;
        setListOfLocations(
            listOfLocations.filter(
                item => {
                    if (!removed && item.name === e) {
                        removed = true;
                        return false;
                    }
                    return true;
                }
            )
        )
    }

    const handleData = () =>  {
        props.extractData(listOfLocations)
        setListOfLocations([])
    }


    return (props.trigger) ? (
        <>
        <div className="display-container">
            <div className="display">
                <APIProvider apiKey={"AIzaSyCJRA498FqP-V_Ozl6649WZpGtnw8fqd6s"}>
                    <div className="map-container" style={{ borderRadius: "20px" }}>
                        <Map
                            defaultZoom={10}
                            defaultCenter={{ lat: 46.2276, lng: 2.2137 }}
                            mapId={"d0eff4764a055a98"}
                            tilt={0}
                            streetViewControl={false}
                            fullscreenControl={false}
                            mapTypeControl={false}
                            zoomControl={true}
                            mapTypeId={'roadmap'}
                            disableDefaultUI={true}
                            minZoom={2}
                            maxZoom={20}
                            onClick={(mapProps) => handleMapClick(mapProps)}
                        >
                            <AdvancedMarker ref={markerRef} position={selectedCoordinates} />
                        </Map>
                        <MapControl position={ControlPosition.TOP_CENTER}>
                            <div className="autocomplete-control" style={{ display: 'grid' }}>
                                <PlacesAutocomplete onPlaceSelect={setSelectedPlace} />
                                <button onClick={addLocation} style={{ width: '100%' }}>
                                    Add this location
                                </button>
                            </div>
                        </MapControl>
                        <MapHandler place={selectedPlace} marker={marker} />
                    </div>
                </APIProvider>
                <div className="list_header">
                    <h3>Click on the location you wish to add</h3>
                <div className="list_container">
                    {listOfLocations.length > 0 ? (
                        <div>
                            <p className="list_heading">List of Selected Locations</p>
                            {listOfLocations.map((list) => {
                                return (
                                    <div className="list_items">
                                        ______________________________________________________
                                        <p className="content">Name: {list.name}</p>
                                        <p className="content">Address: {list.address}</p>
                                        <button className='button' onClick={() => handleDeleteLocation(list.name)}>Remove</button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div>
                            <p className="list_heading">
                                List Of Selected Locations:
                            </p>
                        </div>
                    )}
                    <button style={{backgroundColor:'blue', 
                        color:'white', 
                        borderRadius:'5px', 
                        margin: '10px', 
                        width: '120px',
                        height:'25px'}} onClick={handleData} type="submit">
                        Add to Itinerary!
                    </button>
                </div>
                <div className="close-popup">
                <button onClick={() => props.setTrigger(false)}>Close</button>
                </div>
                </div>
            </div>
            </div>
        </>
    ) : null;
}

export default Googlemaps;
