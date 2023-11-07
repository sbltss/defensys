import { GoogleMap, Marker } from "@react-google-maps/api";
import { Drawer, Input } from "antd";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const MapDrawer = ({ mapOpen, setMapOpen, form }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [coords, setCoords] = useState(null);
  const searchInput = useRef();
  const defaultProps = {
    center: {
      lat: currentUser?.latitude || 14.570805121379165,
      lng: currentUser?.longitude || 121.03702154291699,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  };
  useEffect(() => {
    if (searchInput.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInput.current.input,
        {
          componentRestrictions: { country: ["ph"] },
          fields: ["formatted_address", "geometry"],
          types: ["establishment", "geocode"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setCoords({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });
        form.setFieldsValue({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });
      });
    }
  }, [form]);

  useEffect(() => {
    if (mapOpen) {
      setCoords(null);
    }
  }, [mapOpen]);
  return (
    <Drawer
      title="Tag Location"
      placement="bottom"
      onClose={() => setMapOpen(false)}
      open={mapOpen}
      height={"90%"}
      className={"p-0"}
    >
      <div className="flex flex-col items-center w-full h-full">
        <Input ref={searchInput} className="w-[96%] m-2" />
        <GoogleMap
          onClick={(e) => {
            setCoords({
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
            });

            form.setFieldsValue({
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
            });
          }}
          mapContainerStyle={{ height: "90%", width: "96%" }}
          center={defaultProps.center}
          zoom={defaultProps.zoom}
          options={{ mapId: defaultProps.mapId, disableDefaultUI: true }}
          // onLoad={onLoad}
          // onUnmount={onUnmount}
        >
          {coords && (
            <Marker
              position={{ lat: coords.latitude, lng: coords.longitude }}
            ></Marker>
          )}
        </GoogleMap>
      </div>
    </Drawer>
  );
};

export default MapDrawer;
