import React, { useEffect, useState } from "react";
import { Drawer, Input } from "antd";
import { GoogleMap, Marker } from "@react-google-maps/api";
const MapDrawer = ({
  isMapOpen,
  setIsMapOpen,
  location,
  setLocation,
  locatioName,
}) => {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (!!location?.lat && !!location?.lng)
      setCoords({
        latitude: location?.lat,
        longitude: location?.lng,
      });
    else
      setCoords({
        latitude: 14.570805121379165,
        longitude: 121.03702154291699,
      });
  }, [location?.lat, location?.lng]);
  const defaultProps = {
    center: {
      lat: location?.lat || 14.570805121379165,
      lng: location?.lng || 121.03702154291699,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  };
  return (
    <Drawer
      title="Tag Location"
      placement="right"
      onClose={() => setIsMapOpen(null)}
      open={isMapOpen}
      width={"600px"}
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
            setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          }
          mapContainerStyle={{ height: "90%", width: "96%" }}
          center={defaultProps.center}
          zoom={defaultProps.zoom}
          options={{ mapId: defaultProps.mapId, disableDefaultUI: true }}
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
