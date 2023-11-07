import { GoogleMap, Marker } from "@react-google-maps/api";
import { Drawer } from "antd";
import React from "react";

const LocationDrawer = ({ viewRt, setViewRt }) => {
  const defaultProps = {
    center: {
      lat: viewRt?.lat,
      lng: viewRt?.lng,
    },
    zoom: 13,
    mapId: "15f9baeb3890ce9f",
  };
  return (
    <Drawer
      placement="right"
      title={viewRt ? [viewRt.firstName, viewRt.lastName].join(" ") : ""}
      onClose={() => setViewRt(null)}
      open={viewRt}
      width={"600px"}
    >
      <div className="w-full h-full">
        {viewRt && (
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={defaultProps.center}
            zoom={defaultProps.zoom}
            options={{ mapId: defaultProps.mapId, disableDefaultUI: true }}
          >
            {viewRt?.lat && viewRt?.lng && (
              <Marker
                position={{ lat: viewRt?.lat, lng: viewRt?.lng }}
              ></Marker>
            )}
          </GoogleMap>
        )}
      </div>
    </Drawer>
  );
};

export default LocationDrawer;
