import { useState } from "react";
import {
  Map,
  APIProvider,
  MapControl,
  ControlPosition,
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import "./Googlemaps.css";
import PlacesAutocomplete from "./PlacesAutocomplete";
import MapHandler from "./MapHandler";
import supabase from "../supabaseClient";

const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API || "";
function Googlemaps(props: {
  trigger: any;
  setTrigger: (arg0: boolean) => void;
}) {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [placeId, setSelectedPlaceId] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<google.maps.LatLng | null>(null);

  const handleMapClick = (mapProps: {
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
      const lat = mapProps.detail.latLng.lat();
      const lng = mapProps.detail.latLng.lng();
      setSelectedPlaceId(mapProps.detail.placeId);
      setSelectedCoordinates(new google.maps.LatLng(lat, lng));
    } else {
      alert("Please select a specific location");
    }
  };

  type ListOfLocationsProps = {
    address: string | undefined;
    name: string | undefined;
    location: google.maps.LatLng | null;
  };

  const [listOfLocations, setListOfLocations] = useState<
    ListOfLocationsProps[]
  >([]);

  const addLocation = () => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      placeId: placeId,
      fields: ["name", "formatted_address"],
    };

    service.getDetails(request, (place, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        place != null
      ) {
        setListOfLocations((prevLocations) => [
          ...prevLocations,
          {
            address: place.formatted_address,
            name: place.name,
            location: selectedCoordinates,
          },
        ]);
      }
    });
  };

  const handleDeleteLocation = (
    locationToDelete: google.maps.LatLng | null
  ) => {
    setListOfLocations((prevLocations) =>
      prevLocations.filter((location) => location.location !== locationToDelete)
    );
  };
  
  const addData = async () => {
    const sendData = listOfLocations.map((location) => ({
      address: location.address,
      name: location.name,
      latitude: location.location?.lat(),
      longitude: location.location?.lng(),
    }));

    try {
      const { error } = await supabase.from("data").insert({ data: sendData });

      if (error) {
        console.error("Error inserting data: ", error);
        alert("There was an error adding the data.");
      } else {
        setListOfLocations([]);
        alert("Itinerary added successfully!");
      }
    } catch (err) {
      console.error("Error: ", err);
      alert("There was an error.");
    }
  };

  return props.trigger ? (
    <>
      <div className="display-container">
        <div className="display">
          <APIProvider apiKey={GOOGLE_MAP_API}>
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
                mapTypeId={"roadmap"}
                disableDefaultUI={true}
                minZoom={2}
                maxZoom={20}
                onClick={(mapProps) => handleMapClick(mapProps)}
              >
                <AdvancedMarker
                  ref={markerRef}
                  position={selectedCoordinates}
                />
              </Map>
              <MapControl position={ControlPosition.TOP_CENTER}>
                <div
                  className="autocomplete-control"
                  style={{ display: "grid" }}
                >
                  <PlacesAutocomplete onPlaceSelect={setSelectedPlace} />
                  <button onClick={addLocation} style={{ width: "100%" }}>
                    Add this location
                  </button>
                </div>
              </MapControl>
              <MapHandler place={selectedPlace} marker={marker} />
            </div>
          </APIProvider>
          <div className="list_container">
            {listOfLocations.length > 0 ? (
              <div>
                <p className="list_heading">List of Selected Locations</p>
                {listOfLocations.map((list, index) => (
                  <div key={index} className="list_items">
                    ______________________________________________________
                    <p className="content">Name: {list.name}</p>
                    <p className="content">Address: {list.address}</p>
                    <button
                      className="button"
                      onClick={() => handleDeleteLocation(list.location)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="list_heading">List Of Selected Locations:</p>
              </div>
            )}
            <button
              style={{
                backgroundColor: "blue",
                color: "white",
                borderRadius: "5px",
                margin: "10px",
                width: "120px",
                height: "25px",
              }}
              onClick={addData}
              type="submit"
            >
              Add to Itinerary!
            </button>
          </div>
          <div className="close-popup">
            <button onClick={() => props.setTrigger(false)}>Close</button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}

export default Googlemaps;
