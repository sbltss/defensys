import { useEffect } from "react";
import { useState } from "react";

const UseGeocoder = () => {
  const [geocoder, setGeocoder] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    setGeocoder(new window.google.maps.Geocoder());
  }, []);
  useEffect(() => {
    if (geocoder && location?.lat && location?.lng) {
      geocoder
        .geocode({
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        })
        .then((response) => {
          if (response.results[0])
            setLocationName(response.results[0].formatted_address);
        });
    }
  }, [geocoder, location?.lat, location?.lng]);
  return { setLocation, locationName, locationError };
};

export default UseGeocoder;
