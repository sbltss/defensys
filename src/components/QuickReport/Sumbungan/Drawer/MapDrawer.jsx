import React, { useCallback, useEffect, useState } from "react";
import { Drawer, Input } from "antd";
import Button from "../../../../../UI/Button/Button";
import { GoogleMap, Marker } from "@react-google-maps/api";
const MapDrawer = ({
  isMapOpen,
  setIsMapOpen,
  location,
  setLocation,
  locatioName,
}) => {
  const [map, setMap] = useState(null);
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (!!location?.coords?.latitude && !!location?.coords?.longitude)
      setCoords({
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
      });
    else
      setCoords({
        latitude: 14.570805121379165,
        longitude: 121.03702154291699,
      });
  }, [location?.coords?.latitude, location?.coords?.longitude]);
  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);
  const defaultProps = {
    center: {
      lat: location?.coords?.latitude || 14.570805121379165,
      lng: location?.coords?.longitude || 121.03702154291699,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  };
  return (
    <Drawer
      title="Tag Location"
      placement="bottom"
      onClose={() => setIsMapOpen(null)}
      open={isMapOpen}
      height={"90%"}
      className={"p-0"}
      //   footer={
      //     <div className="flex flex-row justify-end">
      //       <Button type="primary" text="Submit" onClick={() => {}} />
      //     </div>
      //   }
    >
      <div className="flex flex-col items-center w-full h-full">
        <Input
          className="w-[96%] m-2"
          value={locatioName || "Tap to select location"}
          readOnly={true}
        />
        <GoogleMap
          onClick={(e) =>
            setLocation({
              coords: { latitude: e.latLng.lat(), longitude: e.latLng.lng() },
            })
          }
          mapContainerStyle={{ height: "90%", width: "96%" }}
          center={defaultProps.center}
          zoom={defaultProps.zoom}
          options={{ mapId: defaultProps.mapId, disableDefaultUI: true }}
          onLoad={onLoad}
          onUnmount={onUnmount}
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
