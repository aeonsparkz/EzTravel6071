import  { useState, useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import "./Googlemaps.css";


interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };


    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    const handlePlace = () => {
      const selectedPlace = placeAutocomplete.getPlace();
      onPlaceSelect(selectedPlace);
    }

    placeAutocomplete.addListener('place_changed', handlePlace);
  }, [onPlaceSelect, placeAutocomplete]);
  
  return (
    <div className="autocomplete-container">
      <input ref={inputRef} placeholder="Where would you like to go?" style={{ width: '300px', height: '30px', textAlign: 'center' }}/>
    </div>
  );
};

export default PlaceAutocomplete;