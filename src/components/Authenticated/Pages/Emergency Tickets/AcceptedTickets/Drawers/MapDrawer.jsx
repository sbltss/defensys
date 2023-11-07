import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UseFirebaseDB from "../../../../../../Hooks/use-firebasedb";

const MapDrawer = ({ open, onClose }) => {
  const [rtLocations] = UseFirebaseDB("/location");
  const [map, setMap] = useState(null);
  const [defaultProps, setDefaultProps] = useState({
    center: {
      lat: 14.533103851530154,
      lng: 121,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  });

  const { selectedAcceptedTicket, assignedResponseTeams } = useSelector(
    (state) => state.tickets
  );

  useEffect(() => {
    if (selectedAcceptedTicket)
      setDefaultProps((prevState) => ({
        ...prevState,
        center: {
          lat: +selectedAcceptedTicket.latitude,
          lng: +selectedAcceptedTicket.longitude,
        },
      }));
  }, [selectedAcceptedTicket]);
  return (
    <Drawer
      title={"Response Teams Map"}
      height={"80vh"}
      placement="bottom"
      onClose={onClose}
      open={open}
    >
      <div className="flex flex-row h-full">
        <div className="w-[500px] flex flex-col gap-2">
          <span className="text-lg font-medium">Response Teams</span>
          <div className="flex flex-col gap-2">
            {assignedResponseTeams.map((rt) => (
              <div key={rt.accountId}>
                <span>{rt.rtName}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-full">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={defaultProps}
            onLoad={(map) => setMap(map)}
          >
            {selectedAcceptedTicket && (
              <Marker
                icon={{
                  url: selectedAcceptedTicket.caseTypeIcon
                    ? `${import.meta.env.VITE_BASE_URL}/${
                        selectedAcceptedTicket.caseTypeIcon
                      }`
                    : selectedAcceptedTicket.icon
                    ? `${import.meta.env.VITE_BASE_URL}/${
                        selectedAcceptedTicket.icon
                      }`
                    : undefined,
                  scaledSize: { height: 40, width: 40 },
                }}
                position={{
                  lat: +selectedAcceptedTicket.latitude,
                  lng: +selectedAcceptedTicket.longitude,
                }}
              >
                <InfoWindow
                  options={{
                    pixelOffset: selectedAcceptedTicket.caseTypeIcon
                      ? new window.google.maps.Size(0, 0)
                      : new window.google.maps.Size(0, -38),
                  }}
                  position={{
                    lat: +selectedAcceptedTicket.latitude,
                    lng: +selectedAcceptedTicket.longitude,
                  }}
                >
                  <div>
                    <h1 className="font-medium">Emergency Location</h1>
                  </div>
                </InfoWindow>
              </Marker>
            )}
            {assignedResponseTeams.length > 0 &&
              assignedResponseTeams.map((rt) => {
                return (
                  <Marker
                    key={rt.accountId}
                    position={{
                      lat: +rtLocations[rt.accountId]?.latitude,
                      lng: +rtLocations[rt.accountId]?.longitude,
                    }}
                  >
                    <InfoWindow
                      position={{
                        lat: +rtLocations[rt.accountId]?.latitude,
                        lng: +rtLocations[rt.accountId]?.longitude,
                      }}
                    >
                      <div>
                        <h1 className="font-medium">{rt.rtName}</h1>
                      </div>
                    </InfoWindow>
                  </Marker>
                );
              })}
          </GoogleMap>
        </div>
      </div>
    </Drawer>
  );
};

export default MapDrawer;
